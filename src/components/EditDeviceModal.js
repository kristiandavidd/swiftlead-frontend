"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function EditDeviceModal({ isOpen, onClose, selectedDevice, onSuccess }) {
    const [floor, setFloor] = useState(selectedDevice?.floor || "");
    const [installCode, setInstallCode] = useState(selectedDevice?.install_code || "");
    const [status, setStatus] = useState(selectedDevice?.status || 0);
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");

    const { toast } = useToast();

    useEffect(() => {
        if (selectedDevice) {
            setFloor(selectedDevice.floor);
            setInstallCode(selectedDevice.install_code);
            setStatus(selectedDevice.status);

            // Konversi tanggal ke format lokal (YYYY-MM-DD)
            setCreatedAt(new Date(selectedDevice.created_at).toISOString().split("T")[0]);
            setUpdatedAt(new Date(selectedDevice.updated_at).toISOString().split("T")[0]);
        }
    }, [selectedDevice]);

    const handleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/device/update/${selectedDevice.id}`, {
                floor,
                status,
                created_at: createdAt,
                updated_at: updatedAt,
            });

            toast({
                title: "Sukses!",
                description: "Perangkat berhasil diperbarui.",
                variant: "success",
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating device:", error);
            toast({
                title: "Galat!",
                description: "Gagal memperbarui perangkat.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Memperbarui Perangkat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Kode instalasi</label>
                        <Input type="text" value={installCode} readOnly disabled className="bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Lantai pemasangan</label>
                        <Input
                            type="number"
                            placeholder="Masukan lantai yang baru.."
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Tanggal instalasi</label>
                        <Input
                            type="date"
                            value={createdAt}
                            onChange={(e) => setCreatedAt(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Tanggal terakhir pemeliharaan</label>
                        <Input
                            type="date"
                            value={updatedAt}
                            onChange={(e) => setUpdatedAt(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Status</label>
                        <Select value={status.toString()} onValueChange={(value) => setStatus(parseInt(value, 10))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Tidak Aktif</SelectItem>
                                <SelectItem value="1">Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit}>Perbarui</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

