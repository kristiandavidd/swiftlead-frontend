"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";

export default function AddSwiftletHouseModal({ onClose, isOpen }) {
    const [houseName, setHouseName] = useState("");
    const [houseAddress, setHouseAddress] = useState("");
    const { toast } = useToast();
    const { user } = useUser();

    const handleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        if (!houseName || !houseAddress) {
            toast({
                title: "Galat!",
                description: "Tolong isi semua bagian.",
                variant: "destructive",
            });
            return;
        }

        try {
            await axios.post(`${apiUrl}/request/add`, {
                userId: user?.id,
                name: houseName,
                location: houseAddress,
            });

            toast({
                title: "Sukses!",
                description: "Kandang walet berhasil ditambahkan.",
                variant: "success",
            });

            setHouseName("");
            setHouseAddress("");
            onClose(true);
        } catch (error) {
            toast({
                title: "Galat!",
                description: error.response?.data?.message || "Gagal menambahkan kandang walet.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Tambah Kandang Walet</DialogTitle>
                <div className="space-y-4">
                    <div>
                        <label for="">Nama Kandang</label>
                        <Input
                            type="text"
                            placeholder="Nama kandang"
                            value={houseName}
                            onChange={(e) => setHouseName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label for="">Alamat Kandang</label>
                        <Input
                            type="text"
                            placeholder="Alamat kandang walet"
                            value={houseAddress}
                            onChange={(e) => setHouseAddress(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
