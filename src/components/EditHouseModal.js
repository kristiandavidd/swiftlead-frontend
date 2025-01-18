import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";  // Pastikan untuk mengimpor useEffect
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function EditHouseModal({ house, onClose, isOpen }) {
    console.log("from modal: ", house);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const houseId = house?.house_id;
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();

    // Memperbarui nilai name dan location saat house berubah
    useEffect(() => {
        if (house) {
            setName(house.house_name || "");
            setLocation(house.location || "");
        }
    }, [house]);  // Menambahkan house sebagai dependency untuk update state

    const editHouse = async () => {
        if (!houseId) {
            toast({ title: "Error", description: "Invalid house ID", variant: "destructive" });
            return;
        }
        console.log("houseId", houseId);
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/device/house/${houseId}`, { name, location });
            toast({ title: "Success", description: "House updated successfully.", variant: "success" });
            onClose();
        } catch (error) {
            console.error("Error updating house:", error);
            toast({ title: "Error", description: error.response?.data?.error || "Failed to update house.", variant: "destructive" });
        }
    }

    return (
        <Dialog title="Edit House" onOpenChange={onClose} open={isOpen}>
            <DialogContent>
                <DialogTitle className="font-semibold">Edit House</DialogTitle>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name">Name</label>
                        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="location">Location</label>
                        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button label="Cancel" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button label="Save" onClick={editHouse} loading={loading}>Submit</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
