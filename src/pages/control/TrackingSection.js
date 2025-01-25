"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/userContext";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function TrackingSection() {
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rescheduleData, setRescheduleData] = useState({ uniqueId: null, id: null, type: null, newDate: "" });
    const { toast } = useToast();
    const { user } = useUser();

    const statusMapping = {
        0: { label: "Menunggu", progress: 25, color: "default" },
        1: { label: "Pengecekan", progress: 50, color: "default" },
        2: { label: "Disetujui", progress: 75, color: "default" },
        3: { label: "Selesai", progress: 100, color: "default" },
        4: { label: "Dibatalkan", progress: 100, color: "destructive" },
        5: { label: "Ditolak", progress: 100, color: "destructive" },
        6: { label: "Dijadwalkan Ulang", progress: 100, color: "reschedule" },
    };

    useEffect(() => {
        if (user?.id) fetchTrackingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchTrackingData = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/request/tracking/${user.id}`);
            const dataWithUniqueIds = res.data.map((item) => ({
                ...item,
                uniqueId: `${item.type}-${item.id}`,
            }));
            setTrackingData(dataWithUniqueIds);
        } catch (error) {
            console.error("Error fetching tracking data:", error);
            toast({
                title: "Galat!",
                description: "Gagal mendapatkan data riwayat pengajuan.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id, type) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.put(`${apiUrl}/request/cancel/${id}`, { type });

            toast({
                title: "Sukses!",
                description: response.data.message,
                variant: "success",
            });

            fetchTrackingData();
        } catch (error) {
            console.error("Error cancelling request:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Gagal untuk membatalkan pengajuan.",
                variant: "destructive",
            });
        }
    };

    const handleRescheduleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.put(`${apiUrl}/request/reschedule`, {
                id: rescheduleData.id,
                type: rescheduleData.type,
                appointment_date: rescheduleData.newDate,
            });

            toast({
                title: "Sukses!",
                description: response.data.message,
                variant: "success",
            });

            setRescheduleData({ uniqueId: null, id: null, type: null, newDate: "" });
            fetchTrackingData();
        } catch (error) {
            console.error("Error rescheduling request:", error);
            toast({
                title: "Galat!",
                description: error.response?.data?.message || "Gagal menjadwalkan ulang pengajuan.",
                variant: "destructive",
            });
        }
    };

    const handleRescheduleChange = (uniqueId, id, type, newDate) => {
        setRescheduleData({ uniqueId, id, type, newDate });
    };

    return (
        <div className="p-4">
            {loading ? (
                <div className="flex items-center justify-center h-32">
                    <Spinner />
                </div>
            ) : (
                trackingData.map((item) => (
                    <div key={item.uniqueId} className="w-full pb-4 mb-4 border-b">
                        <div className="flex justify-between w-full">
                            <div className="w-3/5">
                                <h2 className="font-semibold capitalize">
                                    {item.type} Sensor {item.house_name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Lantai {item.floors}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Janji Temu:{" "}
                                    {new Date(item.appointment_date).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }) || "N/A"}
                                </p>

                                {item.status === 6 && (
                                    <div className="flex items-center w-1/2 gap-2 my-2">
                                        <Input
                                            type="date"
                                            value={rescheduleData.uniqueId === item.uniqueId ? rescheduleData.newDate : ""}
                                            onChange={(e) =>
                                                handleRescheduleChange(item.uniqueId, item.id, item.type, e.target.value)
                                            }
                                        />
                                        <Button
                                            onClick={handleRescheduleSubmit}
                                            size="sm"
                                            disabled={!rescheduleData.newDate || rescheduleData.uniqueId !== item.uniqueId}
                                        >
                                            Jadwalkan Ulang
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center w-2/5 gap-4 text-center">
                                <span
                                    className={`block text-sm w-1/4 font-semibold ${statusMapping[item.status]?.color === "destructive"
                                        ? "text-destructive"
                                        : "text-primary"
                                        }`}
                                >
                                    {statusMapping[item.status]?.label || "Unknown"}
                                </span>
                                <Progress
                                    value={statusMapping[item.status]?.progress || 0}
                                    className="w-1/2 mt-2 bg-muted-foreground/40"
                                    indicatorColor={
                                        statusMapping[item.status]?.color === "destructive"
                                            ? "bg-destructive"
                                            : statusMapping[item.status]?.color === "reschedule"
                                                ? "bg-green-500"
                                                : "bg-primary"
                                    }
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-1/4 mt-2 border-destructive text-destructive"
                                            disabled={item.status === 3 || item.status === 4 || item.status === 5}
                                        >
                                            Batalkan
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                                            <AlertDialogDescription>Aksi ini tidak bisa dikembalikan.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleCancel(item.id, item.type)}>
                                                Konfirmasi
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
