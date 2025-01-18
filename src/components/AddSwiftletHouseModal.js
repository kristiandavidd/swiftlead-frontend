"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";

const AddSwiftletHouseModal = ({ onClose, isOpen }) => {
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
                title: "Error",
                description: "Please fill out all fields.",
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
                title: "Success",
                description: "Swiftlet house added successfully.",
                variant: "success",
            });

            // Close modal and clear inputs
            setHouseName("");
            setHouseAddress("");
            onClose(true);
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add swiftlet house.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Tambah Rumah Walet</DialogTitle>
                <div className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Nama Rumah"
                        value={houseName}
                        onChange={(e) => setHouseName(e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Alamat Rumah"
                        value={houseAddress}
                        onChange={(e) => setHouseAddress(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddSwiftletHouseModal;
