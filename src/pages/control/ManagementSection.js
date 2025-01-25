"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { IconTrash, IconEdit, IconWrench, IconSettings2, IconStairs } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { Edit } from "lucide-react";
import EditHouseModal from "@/components/EditHouseModal";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import RequestMaintenanceModal from "@/components/RequestMaintenanceModal";
import { Badge } from "@/components/ui/badge";
import RequestUninstallationModal from "@/components/RequestUninstallationModal";
import Spinner from "@/components/ui/spinner";

export default function ManagementSection() {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [houseId, setHouseId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [houseNameData, setHouseNameData] = useState("");

    const { toast } = useToast();
    const { user } = useUser();

    useEffect(() => {
        fetchHouses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHouses = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/device/houses/${user.id}`);
            setHouses(res.data);
        } catch (error) {
            console.error("Error fetching houses:", error);
            toast({ title: "Galat!", description: "Gagal mendapatkan data kandang.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const deleteHouse = async (houseId) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.delete(`${apiUrl}/device/house/${houseId}`);
            toast({ title: "Sukses!", description: "Berhasil menghapus data kandang.", variant: "success" });
            fetchHouses();
        } catch (error) {
            console.error("Error deleting house:", error);
            toast({ title: "Galat!", description: error.response?.data?.error || "Gagal menghapus data kandang.", variant: "destructive" });
        }
    };

    const openModal = (house) => {
        setSelectedHouse(house);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedHouse(null)
        fetchHouses();
    }

    const openMaintenanceModal = (device, house) => {
        setSelectedDevice(device);
        setHouseNameData(house);
        setIsMaintenanceModalOpen(true);
    }

    const closeMaintenanceModal = () => {
        setIsMaintenanceModalOpen(false);
        setSelectedDevice(null);
        setHouseNameData("");

        fetchHouses();
    }

    const openUninstallationModal = (device, house) => {
        setSelectedDevice(device);
        setHouseNameData(house);
        setIsUninstallModalOpen(true);
    }

    const closeUninstallationModal = () => {
        setIsUninstallModalOpen(false);
        setSelectedDevice(null);
        setHouseNameData("");
        fetchHouses();
    }

    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Spinner />
                </div>
            ) : (
                houses.map((house) => (
                    <div key={house.house_id} className="p-4 mb-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-semibold">{house.house_name}</h2>
                                <p className="text-sm text-muted-foreground">{house.location}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        console.log(house)
                                        openModal(house);
                                    }}
                                >
                                    <IconEdit /> Perbarui
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={house.devices.length > 0}
                                            className="border-destructive"

                                        >
                                            <IconTrash /> Hapus
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                                            <AlertDialogDescription>Aksi ini tidak bisa dikembalikan.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    if (house.devices.length > 0) {
                                                        toast({ title: "Gagal!", description: "Tidak bisa menghapus kandang dengan perangkat terpasang.", variant: "destructive" });
                                                    } else {
                                                        deleteHouse(house.house_id);
                                                    }
                                                }}
                                            >
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </div>
                        </div>
                        <div className="space-y-2">

                            {house.devices.map((device, index) => (
                                <div key={device.id} className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="flex items-center gap-2 px-3 py-2 border rounded-lg text-primary bg-muted border-primary">
                                            <IconStairs size={18} strokeWidth={1.2} />
                                            {device.floor}
                                        </span>
                                        {console.log("status", device.status)}
                                        Sensor {index + 1} {device.status === 0 ? <Badge className="font-normal text-white bg-destructive">Tidak Aktif</Badge> : ""}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openMaintenanceModal(device, house.house_name)}
                                        >
                                            <IconSettings2 /> Perbaiki
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openUninstallationModal(device, house.house_name)}
                                        >
                                            <IconTrash /> Copot
                                        </Button>

                                    </div>

                                </div>
                            ))}
                        </div>
                        <EditHouseModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            house={selectedHouse}
                        />
                        <RequestMaintenanceModal
                            isOpen={isMaintenanceModalOpen}
                            onClose={closeMaintenanceModal}
                            deviceData={selectedDevice}
                            houseNameData={houseNameData}
                        />
                        <RequestUninstallationModal
                            isOpen={isUninstallModalOpen}
                            onClose={closeUninstallationModal}
                            deviceData={selectedDevice}
                            houseNameData={houseNameData}
                        />
                    </div>
                ))
            )}

        </div>

    );
}
