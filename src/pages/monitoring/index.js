import { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
});

export default function Home() {
    const [sensorData, setSensorData] = useState({ suhu: 0, kelembapan: 0 });

    useEffect(() => {
        socket.on('sensorData', (data) => {
            console.log('Data received from WebSocket:', data);
            setSensorData(data);
        });

        return () => {
            socket.off('sensorData');
        };
    }, []);
    return (
        <div>
            <h1>Real-Time Sensor Data</h1>
            <p>Suhu: {sensorData.suhu}°C</p>
            <p>Kelembapan: {sensorData.kelembapan}%</p>
        </div>
    );
}
