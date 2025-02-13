import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import MaintenanceDetailModal from "@/components/MaintenanceDetailModal";

const statusOptions = [
    { value: 0, label: "Menunggu" },
    { value: 1, label: "Pengecekan" },
    { value: 2, label: "Disetujui" },
    { value: 3, label: "Selesai" },
    { value: 4, label: "Dibatalkan" },
    { value: 5, label: "Ditolak" },
    { value: 6, label: "Dijadwalkan Ulang" },
];

export default function MaintenanceSection({ setActiveTab }) {
    const [maintenances, setMaintenances] = useState([]);
    const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalProcessOpen, setIsModalProcessOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchMaintenances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = (maintenanceId) => {
        setSelectedMaintenanceId(maintenanceId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMaintenanceId(null);
    };

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/request/maintenance/${id}/status`, { status: newStatus });
            toast({ title: "Sukses!", description: "Berhasil memperbarui status pemeliharaan.", variant: "success" });
            fetchMaintenances();
        } catch (error) {
            console.error("Error updating maintenance status:", error);
            toast({ title: "Galat!", description: "Gagal memperbarui status pemeliharaan.", variant: "destructive" });
        }
    };

    const fetchMaintenances = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/request/maintenance`);
            setMaintenances(res.data);
        } catch (error) {
            console.error("Error fetching maintenances:", error);
            toast({ title: "Galat!", description: "Gagal mengambil data pemeliharaan.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredMaintenances = maintenances.filter((maintenance) => {
        switch (statusFilter) {
            case "all":
                return true;
            case "selesai":
                return maintenance.status === 3;
            case "canceled":
                return maintenance.status === 4 || maintenance.status === 5;
            case "reschedule":
                return maintenance.status === 6;
            default:
                return true;
        }
    });

    return (
        <div>
            {/* Filter Buttons */}
            <div className="flex gap-2 mx-2 my-6">
                <Button
                    size="sm"
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                >
                    Semua
                </Button>
                <Button
                    size="sm"
                    variant={statusFilter === "selesai" ? "default" : "outline"}
                    onClick={() => setStatusFilter("selesai")}
                >
                    Selesai
                </Button>
                <Button
                    size="sm"
                    variant={statusFilter === "canceled" ? "default" : "outline"}
                    onClick={() => setStatusFilter("canceled")}
                >
                    Ditolak & Dibatalkan
                </Button>
                <Button
                    size="sm"
                    variant={statusFilter === "reschedule" ? "default" : "outline"}
                    onClick={() => setStatusFilter("reschedule")}
                >
                    Dijadwalkan Ulang
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Pemilik</TableHead>
                        <TableHead>Lokasi RBW</TableHead>
                        <TableHead>Lantai Pemeliharaan</TableHead>
                        <TableHead>Tanggal Pemeliharaan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                <Spinner />
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredMaintenances.map((maintenance) => (
                            <TableRow key={maintenance.id}>
                                <TableCell>{maintenance.user_name}</TableCell>
                                <TableCell>{maintenance.location}</TableCell>
                                <TableCell>{maintenance.floors}</TableCell>
                                <TableCell>
                                    {new Date(maintenance.appointment_date).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={maintenance.status.toString()}
                                        onValueChange={(value) => handleStatusChange(maintenance.id, parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedMaintenanceId(maintenance.id);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Detail
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <MaintenanceDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedMaintenanceId(null);
                }}
                maintenanceId={selectedMaintenanceId}
            />
        </div>
    );
}
