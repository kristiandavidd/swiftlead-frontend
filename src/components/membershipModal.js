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

    useEffect(() => {
        if (isOpen) {
            fetchEligibleUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            toast({ title: "Galat!", description: "Gagal mengambil data pengguna yang memenuhi syarat.", variant: "destructive" });
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

            toast({ title: "Sukses!", description: "Membership berhasil ditambahkan.", variant: "success" });

            setSelectedUserId("");
            setStartDate("");
            setEndDate("");
            await fetchEligibleUsers();

            onClose();
        } catch (error) {
            console.error("Error adding membership:", error);
            toast({ title: "Galat!", description: "Gagal pengguna ke menambahkan membership.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambahkan Membership</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label for="">Pilih pengguna</label>
                        <Select onValueChange={(value) => setSelectedUserId(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih pengguna" />
                            </SelectTrigger>
                            <SelectContent>
                                {eligibleUsers.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label for="startDate">Tanggal mulai berlangganan</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <label for="endDate">Tanggal berakhir berlangganan</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={onClose}>Batal</Button>
                        <Button onClick={handleSubmit}>Tambahkan</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
