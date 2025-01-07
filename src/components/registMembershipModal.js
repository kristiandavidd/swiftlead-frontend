"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';

export default function RegistMembershipModal({ isOpen, onClose }) {
    const [selectedDuration, setSelectedDuration] = useState('1'); // Default 1 bulan
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    console.log("user", user);

    const calculatePrice = (duration) => {
        return 70000 * parseInt(duration); // Harga per bulan adalah 70.000
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
                title: "Redirecting...",
                description: "You will be redirected to the payment page.",
                variant: "default",
            });

            window.location.href = response.data.redirect_url; // Redirect ke halaman pembayaran
        } catch (error) {
            console.error("Error creating membership:", error);
            toast({
                title: "Error",
                description: "Failed to create membership",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register Membership</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>
                        <strong>Name:</strong> {user?.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>
                    <Select onValueChange={(value) => setSelectedDuration(value)} value={selectedDuration}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 Month - Rp 70,000</SelectItem>
                            <SelectItem value="2">2 Months - Rp 140,000</SelectItem>
                            <SelectItem value="3">3 Months - Rp 210,000</SelectItem>
                            <SelectItem value="6">6 Months - Rp 420,000</SelectItem>
                            <SelectItem value="12">1 Year - Rp 840,000</SelectItem>
                        </SelectContent>
                    </Select>
                    <p>
                        <strong>Total Price:</strong> Rp {calculatePrice(selectedDuration).toLocaleString('id-ID')}
                    </p>
                    <Button onClick={handleSubmit}>Subscribe Now</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
