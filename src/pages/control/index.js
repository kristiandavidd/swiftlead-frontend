import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/UserLayout';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { initSocket } from '@/utils/socket';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import axios from 'axios';

export default function Control() {
    const [sensorData, setSensorData] = useState({ suhu: 0, kelembapan: 0 });
    const [dailyData, setDailyData] = useState({ suhu: [], kelembapan: [] });
    const [monthlyData, setMonthlyData] = useState({ suhu: [], kelembapan: [] });
    const [timeRange, setTimeRange] = useState('daily');
    const router = useRouter();

    const statusSuhu = sensorData.suhu > 29 ? 'Too warm' : sensorData.suhu < 27 ? 'Too cold' : 'Good';
    const statusKelembapan = sensorData.kelembapan > 70 ? 'Too humid' : sensorData.kelembapan < 65 ? 'Too dry' : 'Good';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }

        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        const fetchDailyData = async () => {
            const res = await axios.get(`${apiUrl}/control/daily`);
            const suhu = res.data.map((d) => d.avgSuhu);
            const kelembapan = res.data.map((d) => d.avgKelembapan);
            setDailyData({ suhu, kelembapan });
        };

        const fetchMonthlyData = async () => {

            const res = await axios.get(`${apiUrl}/control/monthly`);
            const suhu = res.data.map((d) => d.avgSuhu);
            const kelembapan = res.data.map((d) => d.avgKelembapan);
            setMonthlyData({ suhu, kelembapan });
        };

        fetchDailyData();
        fetchMonthlyData();
    }, [router]);

    useEffect(() => {
        const socket = initSocket();

        socket.on('sensorData', (data) => {
            setSensorData(data);
        });

        return () => {
            socket.off('sensorData');
        };
    }, []);

    const chartData = timeRange === 'daily' ? dailyData : monthlyData;

    const suhuData = {
        labels: timeRange === 'daily'
            ? chartData.suhu.map((_, index) => `${index}:00`)
            : chartData.suhu.map((d) => d.date),
        datasets: [
            {
                label: 'Suhu (°C)',
                data: chartData.suhu,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    const kelembapanData = {
        labels: timeRange === 'daily'
            ? chartData.kelembapan.map((_, index) => `${index}:00`)
            : chartData.kelembapan.map((d) => d.date),
        datasets: [
            {
                label: 'Kelembapan (%)',
                data: chartData.kelembapan,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    return (
        <UserLayout head={"Control"} key={router.pathname}>
            <div className='mb-6'>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-lg font-semibold'>Control Dashboard</p>
                        <p className='text-sm'>Manage and monitor real-time sensor data.</p>
                    </div>
                </div>

                <div className='flex flex-col gap-2 my-4 md:flex-row'>
                    <Card className="md:w-1/2">
                        <CardHeader>
                            <CardDescription>
                                Real-Time Temperature
                            </CardDescription>
                            <CardTitle>
                                {sensorData.suhu}°C
                                {console.log(sensorData.suhu)}
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <span className='text-sm text-muted-foreground'>
                                Status: {statusSuhu}
                            </span>
                            <Button>See Details</Button>
                        </CardFooter>
                    </Card>

                    <Card className="md:w-1/2">
                        <CardHeader>
                            <CardDescription>
                                Real-Time Humidity
                            </CardDescription>
                            <CardTitle>
                                {sensorData.kelembapan}%
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <span className='text-sm text-muted-foreground'>
                                Status: {statusKelembapan}
                            </span>
                            <Button>See Details</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className='mb-6'>
                <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
                    <div>
                        <p className='text-lg font-semibold'>Temperature & Humidity Trends</p>
                        <p className='text-sm'>View historical sensor data trends per day and month.</p>
                    </div>
                    <Button onClick={() => setTimeRange(timeRange === 'daily' ? 'monthly' : 'daily')}>
                        Switch to {timeRange === 'daily' ? 'Monthly' : 'Daily'} View
                    </Button>
                </div>

                <div className='my-4'>
                    <Card className="w-full mb-4">
                        <CardHeader>
                            <CardTitle>Temperature Trends ({timeRange === 'daily' ? 'Daily' : 'Monthly'})</CardTitle>
                        </CardHeader>
                        <Line data={suhuData} />
                        <CardFooter>
                            <span className='text-sm text-muted-foreground'>Historical temperature data</span>
                        </CardFooter>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Humidity Trends ({timeRange === 'daily' ? 'Daily' : 'Monthly'})</CardTitle>
                        </CardHeader>
                        <Line data={kelembapanData} />
                        <CardFooter>
                            <span className='text-sm text-muted-foreground'>Historical humidity data</span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}
