"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { Separator } from "@/components/ui/separator";

export default function RegistMembershipModal({ isOpen, onClose }) {
    const [selectedDuration, setSelectedDuration] = useState('1');
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    console.log("user", user);

    const calculatePrice = (duration) => {
        return 70000 * parseInt(duration);
    };

    const handleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;


        try {
            const response = await axios.post(`${apiUrl}/payment/create`, {
                user_id: user.id,
                email: user.email,
                name: user.name,
                duration: parseInt(selectedDuration),
                price: calculatePrice(selectedDuration),
            });

            toast({
                title: "Sedang diproses..",
                description: "Anda akan diteruskan ke halaman pembayaran.",
                variant: "default",
            });

            window.location.href = response.data.redirect_url;
        } catch (error) {
            console.error("Error creating membership:", error);
            toast({
                title: "Galat!",
                description: "Gagal mendaftar membership.",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mendaftar Membership</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="table w-full">
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Nama</div>
                            <div className="table-cell text-muted-foreground">{user?.name}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Email</div>
                            <div className="table-cell text-muted-foreground">{user?.email}</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label for="">Pilih paket langganan anda</label>
                        <Select onValueChange={(value) => setSelectedDuration(value)} value={selectedDuration}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih paket" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 Bulan - Rp 70.000</SelectItem>
                                <SelectItem value="2">2 Bulan - Rp 140.000</SelectItem>
                                <SelectItem value="3">3 Bulan - Rp 210.000</SelectItem>
                                <SelectItem value="6">6 Bulan - Rp 420.000</SelectItem>
                                <SelectItem value="12">1 Tahun - Rp 840.000</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator />
                    <p>
                        <strong>Total Pembayaran:</strong> Rp {calculatePrice(selectedDuration).toLocaleString('id-ID')}
                    </p>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={onClose}>Batal</Button>
                        <Button onClick={handleSubmit}>Langganan Sekarang</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
