"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Spinner from "./ui/spinner";

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
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

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
                title: "Galat!",
                description: "Gagal mendapatkan detail membership.",
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
                title: "Sukses!",
                description: "Membership berhasil diperbarui.",
                variant: "success"
            });

            if (typeof onMembershipUpdated === "function") {
                onMembershipUpdated();
            }

            onClose();

        } catch (error) {
            console.error("Error updating membership:", error);
            toast({
                title: "Galat!",
                description: "Gagal memperbarui membership.",
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
                    <DialogTitle>Memperbarui Membership</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Spinner />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-muted-foreground"><span className="text-black">Nama:</span> {formData.name}</p>
                            <p className="text-muted-foreground"><span className="text-black">Email:</span> {formData.email}</p>
                        </div>
                        <div className="space-y-2">
                            <label>Tanggal bergabung</label>
                            <Input
                                type="date"
                                name="join_date"
                                value={formData.join_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Tanggal kadaluarsa</label>
                            <Input
                                type="date"
                                name="exp_date"
                                value={formData.exp_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Status</label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Tidak aktif</SelectItem>
                                    <SelectItem value="1">Aktif</SelectItem>
                                    <SelectItem value="2">Ditangguhkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={onClose}>Batal</Button>
                            <Button onClick={handleUpdate} disabled={saving} className="">
                                {saving ? 'Menyimpan...' : 'Perbarui Membership'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
