import { useEffect, useState, useRef } from 'react';
import UserLayout from '@/layout/UserLayout';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { initSocket } from '@/utils/socket';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IconChevronLeft, IconDownload } from '@tabler/icons-react';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

export default function Temperature() {
    const pdfRef = useRef();
    const [sensorData, setSensorData] = useState({ suhu: 0, kelembapan: 0 });
    const [dailyData, setDailyData] = useState({ suhu: [], labels: [] });
    const [monthlyData, setMonthlyData] = useState({ suhu: [], labels: [] });
    const [timeRange, setTimeRange] = useState('daily');

    // Fetch daily data
    const fetchDailyData = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;
        try {
            const res = await axios.get(`${apiUrl}/control/daily`);

            if (Array.isArray(res.data)) {
                const labels = res.data.map((d) => `${String(d.hour).padStart(2, '0')}:00`);
                const suhu = res.data.map((d) => Number(d.avgSuhu)); // Convert to numbers
                setDailyData({ suhu, labels });
            } else {
                console.error('Unexpected data format:', res.data);
                setDailyData({ suhu: [], labels: [] });
            }
        } catch (error) {
            console.error('Error fetching daily data:', error);
            setDailyData({ suhu: [], labels: [] });
        }
    };

    // Fetch monthly data
    const fetchMonthlyData = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;
        try {
            const res = await axios.get(`${apiUrl}/control/monthly`);

            if (Array.isArray(res.data)) {
                const labels = res.data.map((d) => {
                    const date = new Date(d.date);
                    return date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });
                });
                const suhu = res.data.map((d) => Number(d.avgSuhu)); // Convert to numbers
                setMonthlyData({ suhu, labels });
            } else {
                console.error('Unexpected data format:', res.data);
                setMonthlyData({ suhu: [], labels: [] });
            }
        } catch (error) {
            console.error('Error fetching monthly data:', error);
            setMonthlyData({ suhu: [], labels: [] });
        }
    };

    // Fetch data periodically
    useEffect(() => {
        fetchDailyData();
        fetchMonthlyData();

        const intervalId = setInterval(() => {
            fetchDailyData();
            fetchMonthlyData();
        }, 15 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const chartData = {
        labels: timeRange === 'daily' ? dailyData.labels : monthlyData.labels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: timeRange === 'daily' ? dailyData.suhu : monthlyData.suhu,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
                        return `Temperature: ${value.toFixed(2)}°C`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => value.toFixed(2),
                },
            },
        },
    };

    // Real-time sensor data
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

    // Download PDF
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
            const table = pdfRef.current.querySelector('table');
            doc.autoTable({
                html: table,
                startY: imgHeight + 15,
            });

            doc.save(timeRange === 'daily' ? 'Daily Temperature.pdf' : 'Monthly Temperature.pdf');
            printWindow.close();
        });
    };

    return (
        <UserLayout head="Temperature Details">
            <div className="flex items-center gap-4 mb-6">
                <Link href={"/control"} className='flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground'>
                    <IconChevronLeft size={24} />
                </Link>
                <div>
                    <p className="text-lg font-semibold">Temperature Dashboard</p>
                    <p className="text-sm">Real-time and historical temperature data monitoring.</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="p-4 bg-white rounded-lg shadow">
                    <p className="text-sm text-gray-500">Real-Time Temperature</p>
                    <h2 className="text-2xl font-bold">{sensorData.suhu.toFixed(2)}°C</h2>
                </div>
            </div>

            <div className="mb-6 print-content" ref={pdfRef}>
                <Tabs defaultValue="daily" onValueChange={(value) => setTimeRange(value)} className='flex flex-col gap-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className="text-lg font-semibold">Temperature Trends</p>
                            <p className="text-sm">View daily and monthly temperature trends.</p>
                        </div>
                        <div className='flex items-center justify-between gap-2 no-print'>
                            <Button onClick={downloadPDF} size="sm">
                                <IconDownload size={24} />
                            </Button>
                            <TabsList className="flex items-center">
                                <TabsTrigger
                                    value="daily"
                                    className="px-4 flex items-center py-2 text-sm font-medium rounded-l-md transition-colors data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                                >Daily Trend</TabsTrigger>
                                <TabsTrigger
                                    value="monthly"
                                    className="px-4 flex items-center py-2 text-sm font-medium rounded-r-md transition-colors data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                                >Monthly Trend</TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    <div className='flex w-full p-4 bg-white rounded-lg'>
                        <TabsContent value="daily" className="w-3/4 ">
                            {dailyData.labels.length > 0 ? (
                                <Line data={chartData} options={options} />
                            ) : (
                                <p className="text-center text-gray-500">No data available for daily trends.</p>
                            )}
                        </TabsContent>
                        <TabsContent value="monthly" className="w-3/4 ">
                            {monthlyData.labels.length > 0 ? (
                                <Line data={chartData} options={options} />
                            ) : (
                                <p className="text-center text-gray-500">No data available for monthly trends.</p>
                            )}
                        </TabsContent>
                        <ScrollArea className="w-1/4 px-4 text-sm no-print h-72">
                            <table className="w-full border border-collapse border-gray-300 table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300">Time</th>
                                        <th className="px-4 py-2 border border-gray-300">Temp (°C)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(timeRange === 'daily' ? dailyData : monthlyData).labels.map((label, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border border-gray-300">{label}</td>
                                            <td className="px-4 py-2 border border-gray-300">{chartData.datasets[0].data[index].toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ScrollArea>
                    </div>
                </Tabs>

            </div>
        </UserLayout>
    );
}
