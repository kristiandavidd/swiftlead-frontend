"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "@/layout/UserLayout";
import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddHarvestModal from "@/components/AddPreHarvestModal";
import { useRouter } from "next/router";
import HarvestChart from "./HarvestChart";

export default function HarvestPage() {
    const [groupedHarvests, setGroupedHarvests] = useState({});
    const [activeTab, setActiveTab] = useState("harvest");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user?.id) fetchHarvests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchHarvests = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/harvest/${user.id}`);
            const grouped = groupByDate(res.data);
            setGroupedHarvests(grouped);
        } catch (error) {
            console.error("Error fetching harvests:", error);
            toast({
                title: "Galat!",
                description: "Gagal mengambil data panen.",
                variant: "destructive",
            });
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        fetchHarvests();
    };

    const handleProceed = (houseId) => {
        setIsModalOpen(false);
        router.push(`/harvest/${houseId}`);
    };

    const groupByDate = (harvests) => {
        return harvests.reduce((acc, harvest) => {
            const date = new Date(harvest.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(harvest);
            return acc;
        }, {});
    };

    return (
        <UserLayout head={"Hasil Panen"}>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Hasil Panen</h1>
                <p className="text-sm">Pantau terus hasil panenmu agar kandangmu semakin optimal.</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                    <TabsList className="grid w-1/2 grid-cols-3 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="harvest">Ringkasan Panen</TabsTrigger>
                        <TabsTrigger className="py-2" value="history">Riwayat Panen</TabsTrigger>
                    </TabsList>
                    <TabsContent value="harvest">
                        <div className="flex items-center justify-between p-4">
                            <h2 className="mb-4 text-xl font-semibold">Grafik Hasil Panen (Setahun Terakhir)</h2>
                            <div className="flex items-center justify-end gap-4 my-4">
                                <Button onClick={() => setIsModalOpen(true)}>
                                    Tambah Hasil Panen
                                </Button>
                                <Link href="/sales/sell-harvest">
                                    <Button variant="outline">Jual Hasil Panenmu</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="w-full h-[80vh]">
                            <HarvestChart />
                        </div>
                    </TabsContent>
                    <TabsContent value="history">
                        {Object.entries(groupedHarvests).map(([date, harvests]) => (
                            <div key={date} className="p-4 my-4 border rounded-lg">
                                <h2 className="mb-4 text-xl font-semibold">Panen {date}</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {harvests.map((harvest) => (
                                        <div key={harvest.id} className="w-full p-2 mb-2 border rounded-md">
                                            <h3 className="mb-2 font-semibold">Lantai {harvest.floor}</h3>
                                            <p>Mangkok: {harvest.bowl} kg ({harvest.bowl_pieces} keping)</p>
                                            <p>Oval: {harvest.oval} kg ({harvest.oval_pieces} keping)</p>
                                            <p>Sudut: {harvest.corner} kg ({harvest.corner_pieces} keping) </p>
                                            <p>Patahan: {harvest.broken} kg ({harvest.broken_pieces} keping)</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
            <AddHarvestModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onProceed={handleProceed}
            />
        </UserLayout>
    );
}
