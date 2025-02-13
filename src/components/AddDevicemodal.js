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
                <div className="w-full space-y-4">
                    <div className="table-row">
                        <div className="table-cell w-3/5 py-1">Nama Kandang</div>
                        <div className="table-cell text-muted-foreground">{requestData?.house_name}</div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell w-3/5 py-1">Alamat</div>
                        <div className="table-cell text-muted-foreground">{requestData?.location}</div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell w-3/5 py-1">Kode Instalasi</div>
                        <div className="table-cell "><strong>{installCode}</strong></div>
                    </div>
                    <div className="space-y-2">
                        <label>Lantai</label>
                        <Input
                            type="number"
                            placeholder="Lantai penempatan perangkat.."
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                        />
                    </div>
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
