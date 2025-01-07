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
            toast({ title: "Error", description: "You must agree to the terms and conditions", variant: "destructive" });
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/payment/create`, {
                user_id: 1, 
                email: "user@example.com",
                name: "John Doe",
            });

            window.location.href = response.data.redirect_url;
        } catch (error) {
            console.error("Error initiating payment:", error);
            toast({ title: "Error", description: "Failed to initiate payment", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-4">
            <p>
                By subscribing to our membership, you agree to our{" "}
                <a href="#" className="text-blue-500 underline">Terms and Conditions</a>.
            </p>
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                />{" "}
                I agree to the terms and conditions
            </label>
            <Button onClick={handleSubscribe}>Subscribe to Membership</Button>
        </div>
    );
}
