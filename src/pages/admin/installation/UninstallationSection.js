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
import UninstallationDetailModal from "@/components/UninstallationDetailModal";
import Spinner from "@/components/ui/spinner";

const statusOptions = [
    { value: 0, label: "Menunggu" },
    { value: 1, label: "Pengecekan" },
    { value: 2, label: "Disetujui" },
    { value: 3, label: "Selesai" },
    { value: 4, label: "Dibatalkan" },
    { value: 5, label: "Ditolak" },
    { value: 6, label: "Dijadwalkan Ulang" },
];

export default function UninstallationSection({ setActiveTab }) {
    const [uninstallations, setUninstallations] = useState([]);
    const [selectedUninstallationId, setSelectedUninstallationId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchUninstallations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUninstallations = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/request/uninstallation`);
            setUninstallations(res.data);
        } catch (error) {
            console.error("Error fetching uninstallations:", error);
            toast({ title: "Galat!", description: "Gagal mengambil data uninstalasi.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/request/uninstallation/${id}/status`, { status: newStatus });
            toast({ title: "Sukses!", description: "Berhasil memperbarui status uninstalasi.", variant: "success" });
            fetchUninstallations();
        } catch (error) {
            console.error("Error updating uninstallation status:", error);
            toast({ title: "Galat!", description: "Gagal memperbarui status uninstalasi.", variant: "destructive" });
        }
    };

    const filteredUninstallations = uninstallations.filter((uninstallation) => {
        switch (statusFilter) {
            case "all":
                return true;
            case "selesai":
                return uninstallation.status === 3;
            case "canceled":
                return uninstallation.status === 4 || uninstallation.status === 5;
            case "reschedule":
                return uninstallation.status === 6;
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
                        <TableHead>Lantai Uninstalasi</TableHead>
                        <TableHead>Tanggal Janji</TableHead>
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
                        filteredUninstallations.map((uninstallation) => (
                            <TableRow key={uninstallation.id}>
                                <TableCell>
                                    {uninstallation.user_name}
                                </TableCell>
                                <TableCell>{uninstallation.location}</TableCell>
                                <TableCell>
                                    {uninstallation.floors}
                                </TableCell>
                                <TableCell>
                                    {new Date(uninstallation.appointment_date).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={uninstallation.status.toString()}
                                        onValueChange={(value) => handleStatusChange(uninstallation.id, parseInt(value))}
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
                                            setSelectedUninstallationId(uninstallation.id);
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

            <UninstallationDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUninstallationId(null);
                }}
                uninstallationId={selectedUninstallationId}
            />
        </div>
    );
}
