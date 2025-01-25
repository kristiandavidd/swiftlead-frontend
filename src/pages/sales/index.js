"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UserLayout from "@/layout/UserLayout";
import Image from "next/image";
import { useUser } from "@/context/userContext";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";

export default function SalesMonitoringPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const { toast } = useToast();
    const [rescheduleData, setRescheduleData] = useState({ id: null, newDate: "" });

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
        if (user?.id) {
            fetchSales();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleRescheduleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.put(`${apiUrl}/sales/reschedule/${rescheduleData.id}`, {
                appointment_date: rescheduleData.newDate,
            });

            toast({
                title: "Sukses!",
                description: response.data.message || "Berhasil menjadwalkan ulang penjualan.",
                variant: "success",
            });

            setRescheduleData({ id: null, newDate: "" });
            fetchSales();
        } catch (error) {
            console.error("Error rescheduling sale:", error);
            toast({
                title: "Galat!",
                description: error.response?.data?.message || "Gagal menjadwalkan ulang penjualan.",
                variant: "destructive",
            });
        }
    };

    const handleRescheduleChange = (id, newDate) => {
        setRescheduleData({ id, newDate });
    };

    const fetchSales = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        if (!user?.id) {
            console.error("User ID not available");
            return;
        }

        try {
            const res = await axios.get(`${apiUrl}/sales/user/${user.id}`);
            setSales(res.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
            toast({
                title: "Galat!",
                description: "Gagal mengambil data penjualan.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.put(`${apiUrl}/sales/cancel/${id}`);

            toast({
                title: "Sukses!",
                description: response.data.message || "Penjualan berhasil dibatalkan.",
                variant: "success",
            });

            // Update the sales data
            fetchSales();
        } catch (error) {
            console.error("Error cancelling sale:", error);
            toast({
                title: "Galat!",
                description: error.response?.data?.message || "Gagal membatalkan penjualan.",
                variant: "destructive",
            });
        }
    };

    return (
        <UserLayout head={"Penjualan"}>
            <h1 className="mb-4 text-2xl font-bold">Pemantauan Penjualan</h1>
            <div className="p-4 bg-white rounded-lg ">
                <Link href="/sales/sell-harvest" className="my-4">
                    <Button>Jual Hasil Panen</Button>
                </Link>
                {loading ? (
                    <div className="flex items-center justify-center w-full h-32">
                        <Spinner />
                    </div>
                ) : (
                    sales.map((sale) => (
                        <div key={sale.id} className="w-full pb-4 my-4 border-b">
                            <div className="flex justify-between w-full">
                                <div className="w-3/5">
                                    <h2 className="font-semibold capitalize">
                                        Penjualan {" "}
                                        {new Date(sale.created_at).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Total berat:{" "}
                                        {(
                                            sale.bowl_weight +
                                            sale.oval_weight +
                                            sale.corner_weight +
                                            sale.broken_weight
                                        ).toFixed(2)}{" "}
                                        kg
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Janji temu:{" "}
                                        {new Date(sale.appointment_date).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }) || "N/A"}
                                    </p>
                                    {sale.status === 6 && (
                                        <div className="flex items-center w-1/2 gap-2 my-2">
                                            <Input
                                                type="date"
                                                value={rescheduleData.id === sale.id ? rescheduleData.newDate : ""}
                                                onChange={(e) =>
                                                    handleRescheduleChange(sale.id, e.target.value)
                                                }
                                            />
                                            <Button
                                                onClick={handleRescheduleSubmit}
                                                size="sm"
                                                disabled={!rescheduleData.newDate || rescheduleData.id !== sale.id}
                                            >
                                                Jadwalkan Ulang
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center w-2/5 gap-4 text-center">
                                    <span
                                        className={`block text-sm w-1/4 font-semibold ${statusMapping[sale.status]?.color === "destructive"
                                            ? "text-destructive"
                                            : "text-primary"
                                            }`}
                                    >
                                        {statusMapping[sale.status]?.label || "Unknown"}
                                    </span>
                                    <Progress
                                        value={statusMapping[sale.status]?.progress || 0}
                                        className="w-1/2 mt-2 bg-muted-foreground/40"
                                        indicatorColor={
                                            statusMapping[sale.status]?.color === "destructive"
                                                ? "bg-destructive"
                                                : statusMapping[sale.status]?.color === "reschedule"
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
                                                disabled={sale.status === 3 || sale.status === 4 || sale.status === 5}
                                            >
                                                Batal
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
                                                    onClick={() => handleCancel(sale.id)}
                                                    className="bg-destructive hover:bg-destructive/80"
                                                >
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
        </UserLayout>
    );
}
