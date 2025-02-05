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

            toast({ title: "Sukses!", description: "Berhasil menambahkan harga mingguan.", variant: "success" });
        } catch (err) {
            console.error("Error adding weekly prices:", err);
            toast({ title: "Galat!", description: "Gagal menambahkan harga mingguan.", variant: "destructive" });
        }
    };

    return (
        <AdminLayout className="">
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Tambahkan Harga Acuan Per Minggu</h1>
                <p className="text-sm">Menambahkan harga acuan sarang burung walet per minggu.</p>
            </div>
            <div className="container p-4 bg-white rounded-lg">
                <div className="flex items-center w-full gap-4 my-4">
                    <div className="w-1/2 space-y-2">
                        <label className="block font-medium">Tanggal Minggu Dimulai</label>
                        <Input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} />
                    </div>
                    <div className="w-1/2 space-y-2">
                        <label className="block font-medium">Tanggal Minggu Berakhir</label>
                        <Input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} />
                    </div>
                </div>
                <table className="w-full border border-collapse border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left border border-gray-300">Provinsi</th>
                            <th className="p-2 text-left border border-gray-300">Harga (IDR)/Kg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((item, index) => (
                            <tr key={item.province} className="hover:bg-gray-100">
                                <td className="p-2 border border-gray-300">{item.province}</td>
                                <td className="p-2 border border-gray-300">
                                    <Input
                                        type="number"
                                        placeholder="Masukkan harga.."
                                        value={item.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => router.push("/admin/transaction")}>Batal</Button>
                    <Button className="" onClick={handleSubmit}>Simpan</Button>
                </div>
            </div>
        </AdminLayout>
    );
}
