import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/UserLayout';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { initSocket, subscribeToSensor, unsubscribeFromSensor } from '@/utils/socket';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { IconDownload } from '@tabler/icons-react';
import Link from 'next/link';
import { useUser } from '@/context/userContext';
import AddSwiftletHouseModal from '@/components/AddSwiftletHouseModal';
import InstallationModal from '@/components/RequestInstallationModal';
import { useToast } from '@/hooks/use-toast';

export default function ControlSection({ setActiveTab }) {
    const pdfRef = useRef();
    const [sensorData, setSensorData] = useState({ Suhu: null, Kelembaban: null });
    const [dailyData, setDailyData] = useState({ Suhu: [], Kelembaban: [], labels: [] });
    const [monthlyData, setMonthlyData] = useState({ Suhu: [], Kelembaban: [], labels: [] });
    const [isAddSwiftletModalOpen, setIsAddSwiftletModalOpen] = useState(false);
    const [isInstallationModalOpen, setIsInstallationModalOpen] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [timeRange, setTimeRange] = useState('daily');
    const [isLoading, setIsLoading] = useState(false); // State untuk loading
    const [houses, setHouses] = useState({});
    const [dropdownData, setDropdownData] = useState({});
    const [selectedSensor, setSelectedSensor] = useState(null);
    const router = useRouter();
    const socket = initSocket();
    const { user } = useUser();
    const { toast } = useToast();
    const userId = user?.id;

    const statusSuhu = sensorData.Suhu > 29 ? 'Too warm' : sensorData.Suhu < 27 ? 'Too cold' : 'Good';
    const statusKelembaban = sensorData.Kelembaban > 70 ? 'Too humid' : sensorData.Kelembaban < 65 ? 'Too dry' : 'Good';

    const fetchDailyData = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;
        try {
            const res = await axios.get(`${apiUrl}/control/daily`);
            const labels = res.data.map((d) => `${String(d.hour).padStart(2, '0')}:00`);
            const Suhu = res.data.map((d) => Number(d.avgSuhu));
            const Kelembaban = res.data.map((d) => Number(d.avgKelembaban));
            setDailyData({ Suhu, Kelembaban, labels });
        } catch (error) {
            console.error('Error fetching daily data:', error);
            toast({
                title: "Galat!",
                description: "Gagal mendapatkan data harian.",
                variant: "destructive",
            });
        }
    };

    const fetchMonthlyData = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;
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
            const Suhu = res.data.map((d) => Number(d.avgSuhu));
            const Kelembaban = res.data.map((d) => Number(d.avgKelembaban));
            setMonthlyData({ Suhu, Kelembaban, labels });
        } catch (error) {
            console.error('Error fetching monthly data:', error);
            toast({
                title: "Galat!",
                description: "Gagal mendapatkan data bulanan.",
                variant: "destructive",
            });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const chartData = timeRange === 'daily' ? dailyData : monthlyData;

    useEffect(() => {
        if (user?.id) {
            fetchHouses(user.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, isAddSwiftletModalOpen]);

    const fetchHouses = async (userId) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        setIsLoading(true); // Set loading sebelum fetch

        try {
            const response = await axios.get(`${apiUrl}/device/user/${userId}`);
            const data = response.data;

            setHouses(data);

            // Set default kandang, lantai, dan sensor
            const firstHouseId = Object.keys(data)[0];
            if (firstHouseId) {
                setSelectedHouse(firstHouseId);

                const firstFloor = Object.keys(data[firstHouseId]?.floors || [])[0];
                if (firstFloor) {
                    setSelectedFloor(parseInt(firstFloor, 10));

                    const firstSensor = data[firstHouseId].floors[firstFloor][0]?.installCode;
                    if (firstSensor) {
                        setSelectedSensor(firstSensor);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching houses:", error);
            toast({
                title: "Galat!",
                description: "Gagal mendapatkan data kandang.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false); // Matikan loading setelah fetch selesai
        }
    };

    // Realtime data subscription
    useEffect(() => {
        const socket = initSocket();

        if (selectedSensor) {
            console.log(`Subscribing to sensor: ${selectedSensor}`);
            subscribeToSensor({ installCode: selectedSensor });

            socket.on("sensorData", (data) => {
                setSensorData(data);
            });

            socket.on("error", (error) => {
                console.error("Error from server:", error.message);
            });
        }

        return () => {
            console.log("Unsubscribing from sensor");
            setSensorData({ Suhu: null, Kelembaban: null });
            unsubscribeFromSensor();
            socket.off("sensorData");
            socket.off("error");
        };
    }, [selectedSensor]);

    // Handle perubahan kandang
    const handleHouseChange = (houseId) => {
        setIsLoading(true); // Set loading saat mengganti kandang
        unsubscribeFromSensor();
        setSelectedHouse(houseId);

        const firstFloor = Object.keys(houses[houseId]?.floors || [])[0];
        if (firstFloor) {
            setSelectedFloor(parseInt(firstFloor, 10));

            const firstSensor = houses[houseId].floors[firstFloor][0]?.installCode;
            if (firstSensor) {
                setSelectedSensor(firstSensor);
            }
        } else {
            setSelectedFloor(null);
            setSelectedSensor(null);
        }

        setTimeout(() => setIsLoading(false), 300); // Simulasikan loading singkat
    };

    // Handle perubahan lantai
    const handleFloorChange = (floor) => {
        setIsLoading(true); // Set loading saat mengganti lantai
        unsubscribeFromSensor();
        setSelectedFloor(floor);

        const firstSensor = houses[selectedHouse]?.floors[floor]?.[0]?.installCode;
        if (firstSensor) {
            setSelectedSensor(firstSensor);
        } else {
            setSelectedSensor(null);
        }

        setTimeout(() => setIsLoading(false), 300); // Simulasikan loading singkat
    };

    const handleModalClose = (newHouseAdded) => {
        setIsAddSwiftletModalOpen(false);

        if (newHouseAdded) {
            fetchHouses(); // Fetch data kandang terbaru setelah modal ditutup
        }
    };

    const isDataUnavailable = sensorData.Suhu === null && sensorData.Kelembaban === null;

    const combinedData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Suhu (°C)',
                data: chartData.Suhu,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'Kelebaban (%)',
                data: chartData.Kelembaban,
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
                doc.save('Data Harian.pdf');
            } else if (timeRange == "monthly") {
                doc.save('Data Bulanan.pdf');
            } else {
                doc.save('Data.pdf');
            }

            printWindow.close();
        });
    };

    return (
        <div >
            <div className="my-6">
                <div className="space-y-4">
                    <div className='flex justify-between'>
                        <div className='flex w-2/5 gap-4'>
                            <Select
                                onValueChange={handleHouseChange}
                                value={selectedHouse || ""}
                                disabled={Object.keys(houses).length === 0}
                            >
                                <SelectTrigger className="w-full max-w-md">
                                    <SelectValue placeholder="Pilih Kandang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(houses).map((houseId) => (
                                        <SelectItem key={houseId} value={houseId}>
                                            {houses[houseId].name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Dropdown Lantai */}
                            <Select
                                onValueChange={(value) => handleFloorChange(parseInt(value, 10))}
                                value={selectedFloor?.toString() || ""}
                                disabled={!selectedHouse || Object.keys(houses[selectedHouse].floors).length === 0}
                            >
                                <SelectTrigger className="w-full max-w-md">
                                    <SelectValue placeholder="Pilih Lantai" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(houses[selectedHouse]?.floors || {}).map((floor) => (
                                        <SelectItem key={floor} value={floor}>
                                            Lantai {floor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex justify-end w-2/5 gap-4'>
                            <Button onClick={() => setIsInstallationModalOpen(true)} className="w-full " variant="outline">Ajukan instalasi</Button>
                            <Button onClick={() => setIsAddSwiftletModalOpen(true)} className="w-full" >Tambah Rumah Walet</Button>
                        </div>

                    </div>

                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-32 bg-gray-100 border rounded-md">
                        <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
                    </div>
                ) : isDataUnavailable ? (
                    <div className="flex items-center justify-center h-32 my-4 bg-gray-100 border rounded-md">
                        <h2 className="text-xl font-semibold text-gray-600">
                            Ajukan Instalasi
                        </h2>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 my-4">
                        <div className='flex gap-4'>
                            <Card className="md:w-1/2">
                                <CardHeader>
                                    <CardDescription>Suhu Real-Time</CardDescription>
                                    <CardTitle>{sensorData.Suhu ? sensorData.Suhu.toFixed(2) : 0}°C</CardTitle>
                                </CardHeader>
                            </Card>

                            <Card className="md:w-1/2">
                                <CardHeader>
                                    <CardDescription>Kelembaban Real-Time</CardDescription>
                                    <CardTitle>{sensorData.Kelembaban ? sensorData.Kelembaban.toFixed(2) : 0}%</CardTitle>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="flex gap-2">
                            {(houses[selectedHouse]?.floors[selectedFloor] || []).map((sensor, index) => (
                                <Button
                                    key={sensor.installCode}
                                    onClick={() => setSelectedSensor(sensor.installCode)}
                                    variant={sensor.installCode === selectedSensor ? "default" : "outline"}
                                    disabled={isLoading} // Disable tombol saat loading
                                >
                                    {sensor.installCode === selectedSensor && isLoading
                                        ? "Loading..." // Tampilkan loading jika sedang diubah
                                        : `Sensor ${index + 1}`}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-6 print-content" ref={pdfRef}>
                <Tabs defaultValue="daily" onValueChange={(value) => setTimeRange(value)} className='flex flex-col gap-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className="text-lg font-semibold">Grafik Suhu dan Kelembaban</p>
                            <p className="text-sm">Visualisasi grafik suhu dan kelembaban dalam jangka waktu harian maupun bulanan.</p>
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
                                    Data Harian
                                </TabsTrigger>
                                <TabsTrigger
                                    value="monthly"
                                    className="px-4 flex items-center py-2 text-sm font-medium rounded-r-md transition-colors data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                                >
                                    Data Bulanan
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
                                <th className="px-4 py-2 border border-gray-300">Waktu</th>
                                <th className="px-4 py-2 border border-gray-300">Suhu (°C)</th>
                                <th className="px-4 py-2 border border-gray-300">Kelembaban (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.labels.map((label, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border border-gray-300">{label}</td>
                                    <td className="px-4 py-2 border border-gray-300">{chartData.Suhu[index].toFixed(2)}</td>
                                    <td className="px-4 py-2 border border-gray-300">{chartData.Kelembaban[index].toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddSwiftletHouseModal
                isOpen={isAddSwiftletModalOpen}
                onClose={handleModalClose}
            />
            <InstallationModal
                houses={houses}
                isOpen={isInstallationModalOpen}
                onClose={() => setIsInstallationModalOpen(false)}
            />
        </div>
    );
}
