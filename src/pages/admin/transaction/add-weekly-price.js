"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/layout/AdminLayout";

const provinces = [
    "Nanggroe Aceh Darussalam", "Sumatera Utara", "Sumatera Selatan", "Sumatera Barat",
    "Bengkulu", "Riau", "Kepulauan Riau", "Jambi", "Lampung", "Bangka Belitung",
    "Kalimantan Barat", "Kalimantan Timur", "Kalimantan Selatan", "Kalimantan Tengah",
    "Kalimantan Utara", "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah",
    "Daerah Istimewa Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Timur",
    "Nusa Tenggara Barat", "Gorontalo", "Sulawesi Barat", "Sulawesi Tengah",
    "Sulawesi Utara", "Sulawesi Tenggara", "Sulawesi Selatan", "Maluku Utara",
    "Maluku", "Papua Barat", "Papua", "Papua Tengah", "Papua Pegunungan",
    "Papua Selatan", "Papua Barat Daya"
];

export default function AddWeeklyPricePage() {
    const [weekStart, setWeekStart] = useState("");
    const [weekEnd, setWeekEnd] = useState("");
    const [prices, setPrices] = useState(provinces.map(province => ({ province, price: "" })));
    const { toast } = useToast();

    const handlePriceChange = (index, value) => {
        const updatedPrices = [...prices];
        updatedPrices[index].price = value;
        setPrices(updatedPrices);
    };

    const handleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.post(`${apiUrl}/weekly-price`, {
                prices,
                week_start: weekStart,
                week_end: weekEnd,
            });
            setPrices(provinces.map(province => ({ province, price: "" })));
            setWeekStart("");
            setWeekEnd("");

            toast({ title: "Success", description: "Weekly prices added successfully", variant: "success" });
        } catch (err) {
            console.error("Error adding weekly prices:", err);
            toast({ title: "Error", description: "Failed to add weekly prices", variant: "destructive" });
        }
    };

    return (
        <AdminLayout className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Add Weekly Bird Nest Prices</h1>
            <div className="container p-4 bg-white rounded-lg">
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Week Start:</label>
                    <Input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} />
                    <label className="block mt-4 mb-2 font-medium">Week End:</label>
                    <Input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} />
                </div>
                <table className="w-full border border-collapse border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left border border-gray-300">Province</th>
                            <th className="p-2 text-left border border-gray-300">Price (IDR)/Kg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((item, index) => (
                            <tr key={item.province} className="hover:bg-gray-100">
                                <td className="p-2 border border-gray-300">{item.province}</td>
                                <td className="p-2 border border-gray-300">
                                    <Input
                                        type="number"
                                        placeholder="Enter Price"
                                        value={item.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button className="mt-4" onClick={handleSubmit}>Submit Prices</Button>
            </div>
        </AdminLayout>
    );
}
