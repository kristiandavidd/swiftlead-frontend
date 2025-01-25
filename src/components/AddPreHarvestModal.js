"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/router";

export default function AddHarvestModal({ isOpen, onClose }) {
    const [swiftletHouses, setSwiftletHouses] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [houses, setHouses] = useState({});
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();

    const fetchHouses = async (userId) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        setIsLoading(true); // Set loading sebelum fetch

        try {
            const response = await axios.get(`${apiUrl}/device/user/${user.id}`);
            const data = response.data;

            setHouses(data);

            // Set default kandang, lantai, dan sensor
            const firstHouseId = Object.keys(data)[0];
            if (firstHouseId) {
                setSelectedHouse(firstHouseId);

                const firstFloor = Object.keys(data[firstHouseId]?.floors || [])[0];
                if (firstFloor) {
                    setSelectedFloor(parseInt(firstFloor, 10));

                    const firstSensor = data[firstHouseId].floors[firstFloor][0]?.installCode;
                    if (firstSensor) {
                        setSelectedSensor(firstSensor);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching houses:", error);
            toast({
                title: "Galat!",
                description: "Gagal mendapatkan data kandang.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false); // Matikan loading setelah fetch selesai
        }
    };

    const handleHouseChange = (houseId) => {
        setSelectedHouse(houseId);
        setSelectedFloor(null);
        setSelectedSensor(null);
    }

    const onProceed = (houseId) => {
        console.log("Proceed to harvest in house:", houseId);
        onClose();
        router.push(`/harvest/${houseId}`);
    }

    useEffect(() => {
        if (isOpen) {
            fetchHouses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    console.log(isOpen)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Panen</DialogTitle>
                </DialogHeader>
                <p>
                    Silakan pilih kandang lalu hitung terlebih dulu sarang burung walet,
                    untuk masing-masing sarang burung di kandang tersebut.
                </p>
                <Select
                    onValueChange={handleHouseChange}
                    value={selectedHouse || ""}
                    disabled={Object.keys(houses).length === 0}
                >
                    <SelectTrigger className="w-full max-w-md">
                        <SelectValue placeholder="Pilih Kandang" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(houses).map((houseId) => (
                            <SelectItem key={houseId} value={houseId}>
                                {houses[houseId].name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    onClick={() => onProceed(selectedHouse)}
                    disabled={!selectedHouse}
                    className="mt-6"
                >
                    Saya Siap Panen
                </Button>
            </DialogContent>
        </Dialog>
    );
}
