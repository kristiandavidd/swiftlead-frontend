"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function AddDeviceModal({ isOpen, onClose, requestData, onSuccess, setActiveTab }) {
    const [floor, setFloor] = useState("");
    const [installCode, setInstallCode] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (requestData) {
            generateInstallCode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestData]);

    const generateInstallCode = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.get(`${apiUrl}/device/generate-code`);
            setInstallCode(response.data.install_code);
        } catch (error) {
            console.error("Error generating install code:", error);
            toast({
                title: "Galat!",
                description: "Gagal menghasilkan kode instalasi.",
                variant: "destructive",
            });
        }
    };


    const handleSubmit = async () => {
        if (!floor) {
            toast({
                title: "Galat!",
                description: "Lantai penempatan dibutuhkan.",
                variant: "destructive",
            });
            return;
        }

        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.post(`${apiUrl}/device`, {
                id_swiftlet_house: requestData.id_swiftlet_house,
                floor,
                install_code: installCode,
                status: 1,
            });

            toast({
                title: "Sukses!",
                description: "Perangkat berhasil ditambahkan.",
                variant: "success",
            });

            onSuccess();
            onClose();
            setActiveTab("devices");
        } catch (error) {
            console.error("Error adding device:", error);
            toast({
                title: "Galat!",
                description: "Gagal menambahkan perangkat.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Perangkat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <strong>Nama Kandang:</strong> {requestData?.house_name || "N/A"}
                    </div>
                    <div>
                        <strong>Alamat:</strong> {requestData?.location || "N/A"}
                    </div>
                    <div>
                        <strong>Kode Instalasi:</strong> {installCode}
                    </div>
                    <Input
                        type="number"
                        placeholder="Lantai penempatan perangkat.."
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit}>Tambahkan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
