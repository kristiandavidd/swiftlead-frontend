"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export default function HarvestSection() {
    const [weeklyPrices, setWeeklyPrices] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    const apiUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchWeeklyPrices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchWeeklyPrices = async () => {
        try {
            const response = await axios.get(`${apiUrl}/weekly-price/all`);
            // Check if the data is an array; if not, assign an empty array            
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setWeeklyPrices(data);
            setStartDate(response.data.startDate);
            setEndDate(response.data.endDate);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching weekly prices:", error);
            toast({ title: "Galat!", description: "Gagal mengambil data harga mingguan.", variant: "destructive" });
            setError("Failed to fetch data");
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return parseInt(value, 10).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between w-full p-4">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">
                        Harga Sarang Burung Walet
                    </h2>
                    <p>
                        Periode {" "}
                        {new Date(startDate).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                        {" "} - {" "}
                        {new Date(endDate).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>

                <Link href={`/admin/transaction/add-weekly-price`} className="">
                    <Button>Tambah Data Mingguan</Button>
                </Link>
            </div>
            <div className="p-4 bg-white rounded-lg">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Spinner />
                    </div>
                ) : weeklyPrices.length === 0 ? (
                    <p className="text-center">Belum ada data untuk minggu ini.</p>
                ) : (
                    <table className="w-full border border-collapse border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left border border-gray-300">Provinsi</th>
                                <th className="px-4 py-2 text-left border border-gray-300">Harga</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weeklyPrices.map((price) => (
                                <tr key={price.id}>
                                    <td className="px-4 py-2 border border-gray-300">{price.province}</td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        {formatCurrency(price.price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
