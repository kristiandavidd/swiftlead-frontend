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
            toast({ title: "Error", description: "Failed to fetch weekly price", variant: "destructive" });
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
            toast({ title: "Success", description: "Harvest sale submitted successfully", variant: "success" });
        } catch (error) {
            console.error("Error submitting harvest sale:", error);
            toast({ title: "Error", description: "Failed to submit harvest sale", variant: "destructive" });
        }
    };

    return (
        <UserLayout>
            <h1 className="mb-4 text-2xl font-bold">Sell your Birdnest</h1>
            <div className="p-4 bg-white rounded-lg ">
                <div className="space-y-4">
                    <Select onValueChange={setProvince}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Province" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.map((prov) => (
                                <SelectItem key={prov} value={prov}>
                                    {prov}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        value={`Rp ${price ? formatCurrency(price).replace('Rp', '').trim() : ''} / Kg`}
                        readOnly
                        disabled
                    />
                    <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Bowl Weight (kg)"
                        value={bowlWeight}
                        onChange={(e) => setBowlWeight(e.target.value)}
                    />
                    <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Oval Weight (kg)"
                        value={ovalWeight}
                        onChange={(e) => setOvalWeight(e.target.value)}
                    />
                    <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Corner Weight (kg)"
                        value={cornerWeight}
                        onChange={(e) => setCornerWeight(e.target.value)}
                    />
                    <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Broken Weight (kg)"
                        value={brokenWeight}
                        onChange={(e) => setBrokenWeight(e.target.value)}
                    />
                    <Input
                        type="date"
                        placeholder="Appointment Date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                    <Input
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </UserLayout>
    );
}
