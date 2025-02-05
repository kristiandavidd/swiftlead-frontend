"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import UserLayout from "@/layout/UserLayout";
import { useUser } from "@/context/userContext";

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

export default function AddSalePage() {
    const [price, setPrice] = useState('');
    const [province, setProvince] = useState('');
    const [bowlWeight, setBowlWeight] = useState('');
    const [ovalWeight, setOvalWeight] = useState('');
    const [cornerWeight, setCornerWeight] = useState('');
    const [brokenWeight, setBrokenWeight] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [proofPhoto, setProofPhoto] = useState(null);
    const { toast } = useToast();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (province) fetchWeeklyPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [province]);

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number).replace(/\u00A0/g, ' '); // Remove non-breaking space if needed
    };

    const fetchWeeklyPrice = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/weekly-price`, { params: { province } });
            setPrice(res.data.price);
        } catch (error) {
            console.error("Error fetching weekly price:", error);
            toast({ title: "Galat!", description: "Gagal mendapatkan data harga acuan.", variant: "destructive" });
        }
    };

    const handleFileChange = (e) => {
        setProofPhoto(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('province', province);
        formData.append('price', price);
        formData.append('bowl_weight', bowlWeight);
        formData.append('oval_weight', ovalWeight);
        formData.append('corner_weight', cornerWeight);
        formData.append('broken_weight', brokenWeight);
        formData.append('appointment_date', appointmentDate);
        formData.append('proof_photo', proofPhoto);

        try {
            await axios.post(`${apiUrl}/sales`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            router.push("/sales");
            toast({ title: "Sukses!", description: "Pengajuan jual hasil panen berhasil.", variant: "success" });
        } catch (error) {
            console.error("Error submitting harvest sale:", error);
            toast({ title: "Galat!", description: "Gagal mengajukan jual hasil panen.", variant: "destructive" });
        }
    };

    return (
        <UserLayout>
            <div className="container w-2/3 p-4 mx-auto bg-white rounded shadow">
                <h1 className="mb-4 text-2xl font-bold ">Jual Hasil Panenmu</h1>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label for="">Provinsi</label>
                        <Select onValueChange={setProvince}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map((prov) => (
                                    <SelectItem key={prov} value={prov}>
                                        {prov}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label>Harga acuan</label>
                        <Input
                            type="text"
                            value={`Rp ${price ? formatCurrency(price).replace('Rp', '').trim() : ''} / Kg`}
                            readOnly
                            disabled
                        />
                    </div>
                    <div className="flex w-full gap-4">
                        <div className="w-1/2 space-y-2">
                            <label>Berat sarang berbentuk mangkok (kg)</label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="Sarang berbentuk mangkok (kg)"
                                value={bowlWeight}
                                onChange={(e) => setBowlWeight(e.target.value)}
                            />
                        </div>
                        <div className="w-1/2 space-y-2">
                            <label>Berat sarang berbentuk oval (kg)</label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="Sarang berbentuk oval (kg)"
                                value={ovalWeight}
                                onChange={(e) => setOvalWeight(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex w-full gap-4">
                        <div className="w-1/2 space-y-2">
                            <label>Berat sarang berbentuk sudut (kg)</label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="Sarang berbentuk sudut (kg)"
                                value={cornerWeight}
                                onChange={(e) => setCornerWeight(e.target.value)}
                            />
                        </div>
                        <div className="w-1/2 space-y-2">
                            <label for="">Berat sarang berbentuk patahan (kg)</label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="Sarang berbentuk patahan (kg)"
                                value={brokenWeight}
                                onChange={(e) => setBrokenWeight(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label for="">Tanggal janji jual</label>
                        <Input
                            type="date"
                            placeholder="Tanggal janji temu"
                            min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label for="">Bukti hasil panen</label>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <Button variant="outline" onClick={() => router.push("/sales")}>Batal</Button>
                        <Button onClick={handleSubmit}>Jual Panen</Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
