"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function MembershipModal({ isOpen, onClose }) {
    const [eligibleUsers, setEligibleUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { toast } = useToast();

    // Fetch eligible users saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            fetchEligibleUsers();
        }
    }, [isOpen]);

    const fetchEligibleUsers = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/membership/eligible-users`);
            setEligibleUsers(res.data);
        } catch (error) {
            console.error("Error fetching eligible users:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const apiUrl = process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            await axios.post(`${apiUrl}/membership`, {
                user_id: selectedUserId,
                start_date: startDate,
                end_date: endDate
            });

            toast({ title: "Success", description: "Membership added successfully", variant: "success" });

            // Reset form dan fetch ulang data eligible users
            setSelectedUserId("");
            setStartDate("");
            setEndDate("");
            await fetchEligibleUsers();

            onClose(); // Tutup modal setelah submit
        } catch (error) {
            console.error("Error adding membership:", error);
            toast({ title: "Error", description: "Failed to add membership", variant: "destructive" });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Membership</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Select onValueChange={(value) => setSelectedUserId(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent>
                            {eligibleUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name} ({user.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <Button onClick={handleSubmit}>Add</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
