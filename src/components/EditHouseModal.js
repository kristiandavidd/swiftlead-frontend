import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";  // Pastikan untuk mengimpor useEffect
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function EditHouseModal({ house, onClose, isOpen }) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const houseId = house?.house_id;
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();

    useEffect(() => {
        if (house) {
            setName(house.house_name || "");
            setLocation(house.location || "");
        }
    }, [house]);

    const editHouse = async () => {
        if (!houseId) {
            toast({ title: "Galat!", description: "Kandang tidak valid.", variant: "destructive" });
            return;
        }

        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/device/house/${houseId}`, { name, location });
            toast({ title: "Sukses!", description: "Berhasil memperbarui kandang.", variant: "success" });
            onClose();
        } catch (error) {
            console.error("Error updating house:", error);
            toast({ title: "Galat!", description: error.response?.data?.error || "Gagal memperbarui kandang.", variant: "destructive" });
        }
    }

    return (
        <Dialog title="Memperbarui Kandang Walet" onOpenChange={onClose} open={isOpen}>
            <DialogContent>
                <DialogTitle className="font-semibold">Memperbarui Kandang Walet</DialogTitle>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name">Nama kandang walet</label>
                        <Input label="Name" placeholder="Nama Kandang.." value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="location">Alamat kandang walet</label>
                        <Input label="Location" placeholder="Alamat kandang.." value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button label="Cancel" variant="outline" onClick={onClose}>Batal</Button>
                        <Button label="Save" onClick={editHouse} loading={loading}>Simpan</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
