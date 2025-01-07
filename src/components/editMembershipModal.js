"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Fungsi Format Tanggal
const formatISOToDateInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
};

export default function EditMembershipModal({ isOpen, onClose, membershipId, onMembershipUpdated }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        join_date: '',
        exp_date: '',
        status: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // State untuk tombol simpan
    const { toast } = useToast();

    // Fetch data saat modal dibuka dan ID tersedia
    useEffect(() => {
        if (membershipId && isOpen) {
            fetchMembershipDetails();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [membershipId, isOpen]);

    const fetchMembershipDetails = async () => {
        setLoading(true);
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/membership/${membershipId}`);
            setFormData({
                name: res.data.name || '',
                email: res.data.email || '',
                join_date: formatISOToDateInput(res.data.join_date),
                exp_date: formatISOToDateInput(res.data.exp_date),
                status: res.data.status.toString() || '0',
            });
        } catch (error) {
            console.error("Error fetching membership details:", error);
            toast({
                title: "Error",
                description: "Failed to fetch membership details",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            setSaving(true);
            await axios.put(`${apiUrl}/membership/${membershipId}`, formData);
            toast({
                title: "Success",
                description: "Membership updated successfully",
                variant: "success"
            });

            // Panggil prop untuk fetch data terbaru
            if (typeof onMembershipUpdated === "function") {
                onMembershipUpdated();
            }

            // Tutup modal
            onClose();

        } catch (error) {
            console.error("Error updating membership:", error);
            toast({
                title: "Error",
                description: "Failed to update membership",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Membership</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="space-y-4">
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <label>Join Date</label>
                        <Input
                            type="date"
                            name="join_date"
                            value={formData.join_date}
                            onChange={handleChange}
                        />
                        <label>Expiration Date</label>
                        <Input
                            type="date"
                            name="exp_date"
                            value={formData.exp_date}
                            onChange={handleChange}
                        />
                        <label>Status</label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Inactive</SelectItem>
                                <SelectItem value="1">Active</SelectItem>
                                <SelectItem value="2">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleUpdate} disabled={saving} className="w-full">
                            {saving ? 'Saving...' : 'Update Membership'}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
