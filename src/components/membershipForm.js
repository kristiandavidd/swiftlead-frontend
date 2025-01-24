"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function MembershipForm() {
    const [isChecked, setIsChecked] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = async () => {
        if (!isChecked) {
            toast({ title: "Galat!", description: "Anda harus menyetujui syarat dan ketentuan yang berlaku.", variant: "destructive" });
            return;
        }

        try {
            const apiUrl = process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            const response = await axios.post(`${apiUrl}/payment/create`, {
                user_id: 1,
                email: "user@example.com",
                name: "John Doe",
            });

            window.location.href = response.data.redirect_url;
        } catch (error) {
            console.error("Error initiating payment:", error);
            toast({ title: "Galat!", description: "Gagal untuk beralih ke halaman pembayaran.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-4">
            <p>
                Dengan berlangganan, anda telah menyetujui{" "}
                <a href="#" className="text-blue-500 underline">syarat dan ketentuan yang berlaku.</a>.
            </p>
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                />{" "}
                Saya telah membaca dan menyetujui syarat dan ketentuan yang berlaku.
            </label>
            <Button onClick={handleSubscribe}>Berlangganan ke Membership</Button>
        </div>
    );
}
