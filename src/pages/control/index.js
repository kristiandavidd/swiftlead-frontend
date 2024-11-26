import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/UserLayout';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { initSocket } from '@/utils/socket';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { IconDownload } from '@tabler/icons-react';
import Link from 'next/link';

export default function Control() {
    const pdfRef = useRef();
    const [sensorData, setSensorData] = useState({ suhu: 0, kelembapan: 0 });
    const [dailyData, setDailyData] = useState({ suhu: [], kelembapan: [], labels: [] });
    const [monthlyData, setMonthlyData] = useState({ suhu: [], kelembapan: [], labels: [] });
    const [timeRange, setTimeRange] = useState('daily');
    const router = useRouter();

    const statusSuhu = sensorData.suhu > 29 ? 'Too warm' : sensorData.suhu < 27 ? 'Too cold' : 'Good';
    const statusKelembapan = sensorData.kelembapan > 70 ? 'Too humid' : sensorData.kelembapan < 65 ? 'Too dry' : 'Good';

    const fetchDailyData = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const res = await axios.get(`${apiUrl}/control/daily`);
            const labels = res.data.map((d) => `${String(d.hour).padStart(2, '0')}:00`);
            const suhu = res.data.map((d) => Number(d.avgSuhu));
            const kelembapan = res.data.map((d) => Number(d.avgKelembapan));
            setDailyData({ suhu, kelembapan, labels });
        } catch (error) {
            console.error('Error fetching daily data:', error);
        }
    };

    const fetchMonthlyData = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const res = await axios.get(`${apiUrl}/control/monthly`);
            const labels = res.data.map((d) => {
                const date = new Date(d.date);
                return date.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            });
            const suhu = res.data.map((d) => Number(d.avgSuhu));
            const kelembapan = res.data.map((d) => Number(d.avgKelembapan));
            setMonthlyData({ suhu, kelembapan, labels });
        } catch (error) {
            console.error('Error fetching monthly data:', error);
        }
    };

    useEffect(() => {
        fetchDailyData();
        fetchMonthlyData();

        const intervalId = setInterval(() => {
            fetchDailyData();
            fetchMonthlyData();
        }, 15 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [router]);

    const chartData = timeRange === 'daily' ? dailyData : monthlyData;

    useEffect(() => {
        const socket = initSocket();

        socket.on('sensorData', (data) => {
            if (data && data.suhu !== 0 && data.kelembapan !== 0) {
                setSensorData(data);
            }
        });

        return () => {
            socket.off('sensorData');
        };
    }, []);

    const combinedData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: chartData.suhu,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'Humidity (%)',
                data: chartData.kelembapan,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return `${context.dataset.label}: ${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                ticks: {
                    callback: (value) => value.toFixed(2),
                },
            },
            y1: {
                type: 'linear',
                position: 'right',
                ticks: {
                    callback: (value) => value.toFixed(2),
                },
            },
        },
    };

    const downloadPDF = () => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        const noPrintElements = document.querySelectorAll('.no-print');

        noPrintElements.forEach((el) => {
            el.style.visibility = 'hidden';
        });
        html2canvas(pdfRef.current).then((canvas) => {
            const doc = new jsPDF('p', 'mm', 'a4');

            noPrintElements.forEach((el) => {
                el.style.visibility = 'visible';
            });

            const imgData = canvas.toDataURL('image/png');
            const imgHeight = (canvas.height * 190) / canvas.width;

            doc.addImage(imgData, 'PNG', 10, 10, 190, imgHeight);

            const marginBottom = imgHeight + 15;

            const table = pdfRef.current.querySelector('table');
            doc.autoTable({
                html: table,
                startY: marginBottom,
            });

            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);

            printWindow.document.write(`<iframe width="100%" height="100%" src="${pdfUrl}"></iframe>`);

            if (timeRange == "daily") {
                doc.save('Daily Data.pdf');
            } else if (timeRange == "monthly") {
                doc.save('Monthly Data.pdf');
            } else {
                doc.save('Data.pdf');
            }

            printWindow.close();
        });
    };

    return (
        <UserLayout head="Control">
            <div className="mb-6">
                <div className="flex items-center justify-between no-print">
                    <div>
                        <p className="text-lg font-semibold">Control Dashboard</p>
                        <p className="text-sm">Manage and monitor real-time sensor data.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 my-4 md:flex-row">
                    <Card className="md:w-1/2">
                        <CardHeader>
                            <CardDescription>Real-Time Temperature</CardDescription>
                            <CardTitle>{sensorData.suhu.toFixed(2)}°C</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status: {statusSuhu}</span>
                            <Link className='px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90' href={"control/temperature"}>See Details</Link>
                        </CardFooter>
                    </Card>

                    <Card className="md:w-1/2">
                        <CardHeader>
                            <CardDescription>Real-Time Humidity</CardDescription>
                            <CardTitle>{sensorData.kelembapan.toFixed(2)}%</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status: {statusKelembapan}</span>
                            <Link className='px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90' href={"control/humidity"}>See Details</Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className="mb-6 print-content" ref={pdfRef}>
                <Tabs defaultValue="daily" onValueChange={(value) => setTimeRange(value)} className='flex flex-col gap-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className="text-lg font-semibold">Temperature & Humidity Trends</p>
                            <p className="text-sm">View historical sensor data trends per day and month.</p>
                        </div>
                        <div className='flex items-center justify-between gap-2 no-print'>
                            <Button onClick={downloadPDF} size="sm" >
                                <IconDownload size={24} className='' />
                            </Button>
                            <TabsList className="flex items-center">
                                <TabsTrigger
                                    value="daily"
                                    className="flex items-center  justify-center px-4 py-2 text-sm font-medium rounded-l-md transition-colors data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                                >
                                    Daily Trend
                                </TabsTrigger>
                                <TabsTrigger
                                    value="monthly"
                                    className="px-4 flex items-center py-2 text-sm font-medium rounded-r-md transition-colors data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                                >
                                    <p>Monthly Trend</p>
                                </TabsTrigger>
                            </TabsList>

                        </div>
                    </div>

                    <TabsContent className="p-6 bg-white rounded-lg" value="daily">
                        <Line data={combinedData} options={options} />
                    </TabsContent>
                    <TabsContent className="p-6 bg-white rounded-lg" value="monthly">
                        <Line data={combinedData} options={options} />
                    </TabsContent>
                </Tabs>
                <div className="hidden ">
                    <table className="w-full border border-collapse border-gray-300 table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border border-gray-300">Time</th>
                                <th className="px-4 py-2 border border-gray-300">Temperature (°C)</th>
                                <th className="px-4 py-2 border border-gray-300">Humidity (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.labels.map((label, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border border-gray-300">{label}</td>
                                    <td className="px-4 py-2 border border-gray-300">{chartData.suhu[index].toFixed(2)}</td>
                                    <td className="px-4 py-2 border border-gray-300">{chartData.kelembapan[index].toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </UserLayout>
    );
}
