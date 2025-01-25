"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserLayout from "@/layout/UserLayout";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/userContext";

export default function AddHarvestPage() {
    const [floors, setFloors] = useState([{ bowl: "", oval: "", corner: "", broken: "" }]);
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useUser();

    const addFloor = () => {
        setFloors([...floors, { bowl: "", oval: "", corner: "", broken: "" }]);
    };

    const updateFloor = (index, type, value) => {
        const updatedFloors = [...floors];
        updatedFloors[index][type] = value;
        setFloors(updatedFloors);
    };

    const calculateIdealHarvest = (harvest) => {
        return Math.round(harvest * 0.75 * 100) / 100; // Calculate 75% and round to 2 decimals
    };

    const handleSubmit = async () => {
        if (!user?.id) {
            toast({
                title: "Galat!",
                description: "Anda belum masuk.",
                variant: "destructive",
            });
            return;
        }

        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.post(`${apiUrl}/harvest`, {
                user_id: user.id,
                floors: floors.map((floor) => ({
                    ...floor,
                    ideal_bowl: calculateIdealHarvest(floor.bowl),
                    ideal_oval: calculateIdealHarvest(floor.oval),
                    ideal_corner: calculateIdealHarvest(floor.corner),
                    ideal_broken: calculateIdealHarvest(floor.broken),
                })),
            });
            toast({
                title: "Sukses!",
                description: "Berhasil menambahkan hasil panen.",
                variant: "success",
            });
            router.push("/harvest");
        } catch (error) {
            console.error("Error submitting harvest:", error);
            toast({
                title: "Galat!",
                description: "Gagal menambahkan hasil panen.",
                variant: "destructive",
            });
        }
    };

    return (
        <UserLayout head={"Tambah Hasil Panen"}>
            <h1 className="mb-4 text-2xl font-bold">Tambah Hasil Panen</h1>
            <div className="p-4 bg-white rounded-lg ">

                <div className="space-y-4">
                    {floors.map((floor, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                            <h2 className="mb-2 font-semibold">Lantai {index + 1}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    placeholder="Sarang berbentuk mangkok.."
                                    value={floor.bowl}
                                    step="0.1"
                                    onChange={(e) => updateFloor(index, "bowl", e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Sarang berbentuk oval.."
                                    value={floor.oval}
                                    step="0.1"
                                    onChange={(e) => updateFloor(index, "oval", e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Sarang berbentuk sudut.."
                                    value={floor.corner}
                                    step="0.1"
                                    onChange={(e) => updateFloor(index, "corner", e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Sarang berbentuk patahan.."
                                    value={floor.broken}
                                    step="0.1"
                                    onChange={(e) => updateFloor(index, "broken", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-between gap-4">
                        <Button variant="outline" onClick={() => router.push("/harvest")}>Batal</Button>
                        <div className="flex items-center justify-end gap-4 my-4">
                            <Button variant="outline" onClick={addFloor}>Tambah Lantai</Button>
                            <Button onClick={handleSubmit} className="">
                                Kirim Hasil Panen
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
