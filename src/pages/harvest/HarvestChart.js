"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import otomatis untuk mendeteksi jenis chart
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";
import Spinner from "@/components/ui/spinner";

const HarvestChart = () => {
    const [chartData, setChartData] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            fetchChartData();
        }
        // Dependensi hanya pada `user.id` agar fetch tidak dipanggil ulang
    }, [user?.id]);

    const fetchChartData = async () => {
        const apiUrl =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/harvest/${user.id}`);
            const filteredData = filterLastYearData(res.data);
            const formattedData = formatChartData(filteredData);

            // Ganti data lama sepenuhnya
            setChartData(formattedData);
        } catch (error) {
            console.error("Error fetching harvest data for chart:", error);
            toast({
                title: "Galat!",
                description: "Gagal mengambil data untuk grafik panen.",
                variant: "destructive",
            });
        }
    };
    console.log("Formatted Chart Data:", chartData);


    const filterLastYearData = (harvests) => {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return harvests.filter((harvest) => new Date(harvest.created_at) >= oneYearAgo);
    };

    const formatChartData = (harvests) => {
        const groupedData = harvests.reduce((acc, harvest) => {
            const date = new Date(harvest.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            // Jika tanggal sudah ada, tambahkan total
            if (!acc[date]) {
                acc[date] = { totalWeight: 0, totalPieces: 0 };
            }

            acc[date].totalWeight +=
                (parseFloat(harvest.bowl) || 0) +
                (parseFloat(harvest.oval) || 0) +
                (parseFloat(harvest.corner) || 0) +
                (parseFloat(harvest.broken) || 0);

            acc[date].totalPieces +=
                (parseInt(harvest.bowl_pieces) || 0) +
                (parseInt(harvest.oval_pieces) || 0) +
                (parseInt(harvest.corner_pieces) || 0) +
                (parseInt(harvest.broken_pieces) || 0);

            return acc;
        }, {});

        const labels = Object.keys(groupedData);
        const totalWeight = labels.map((date) => groupedData[date].totalWeight);
        const totalPieces = labels.map((date) => groupedData[date].totalPieces);

        return {
            labels,
            datasets: [
                {
                    label: "Total Berat (kg)",
                    data: totalWeight,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.4,
                },
                {
                    label: "Total Keping",
                    data: totalPieces,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    tension: 0.4,
                },
            ],
        };
    };


    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            
            {chartData ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true, position: "top" },
                            tooltip: { mode: "index", intersect: false },
                        },
                        scales: {
                            x: { title: { display: true, text: "Tanggal" } },
                            y: { title: { display: true, text: "Jumlah" } },
                        },
                    }}
                    height={400}
                    style={{ maxHeight: "400px", maxWidth: "100%" }}
                />
            ) : (
                <div className="flex items-center justify-center h-40">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default HarvestChart;
