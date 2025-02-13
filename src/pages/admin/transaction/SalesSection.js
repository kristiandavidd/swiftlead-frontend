"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import SaleDetailsModal from "@/components/salesDetailModal";
import { useToast } from "@/hooks/use-toast";

const statusOptions = [
    { value: 0, label: "Menunggu" },
    { value: 1, label: "Pengecekan" },
    { value: 2, label: "Disetujui" },
    { value: 3, label: "Selesai" },
    { value: 4, label: "Dibatalkan" },
    { value: 5, label: "Ditolak" },
    { value: 6, label: "Dijadwalkan Ulang" },
];

export default function AdminSalesPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSaleId, setSelectedSaleId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchSales();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSales = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/sales`);
            setSales(res.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
            toast({ title: "Galat!", description: "Gagal mendapatkan data penjualan.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/sales/${id}/status`, { status: newStatus });
            toast({ title: "Sukses!", description: "Berhasil memperbarui status penjualan.", variant: "success" });
            fetchSales();
        } catch (error) {
            console.error("Error updating sale status:", error);
            toast({ title: "Galat!", description: "Gagal memperbarui status penjualan.", variant: "destructive" });
        }
    };

    const openModal = (saleId) => {
        setSelectedSaleId(saleId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSaleId(null);
    };

    const filteredSales = sales.filter((sale) => {
        switch (statusFilter) {
            case "all":
                return true;
            case "selesai":
                return sale.status === 3;
            case "canceled":
                return sale.status === 4 || sale.status === 5;
            case "reschedule":
                return sale.status === 6;
            default:
                return true;
        }
    });

    console.log(sales)

    return (
        <div>
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
                        <TableHead>Penjual</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Provinsi</TableHead>
                        <TableHead>Total Harga Beli Acuan</TableHead>
                        <TableHead>Total Sarang</TableHead>
                        <TableHead>Tanggal Janji</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan="6" className="text-center">
                                <Spinner />
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredSales.map((sale) => {
                            const totalSarang = (
                                parseFloat(sale.bowl_weight) +
                                parseFloat(sale.oval_weight) +
                                parseFloat(sale.corner_weight) +
                                parseFloat(sale.broken_weight)
                            );

                            const totalHarga = sale.price * totalSarang;

                            return (
                                <TableRow key={sale.id}>
                                    <TableCell>{sale.user_name}</TableCell>
                                    <TableCell>{sale.user_location}</TableCell>
                                    <TableCell>{sale.province}</TableCell>
                                    <TableCell>
                                        {parseFloat(totalHarga).toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {totalSarang.toFixed(2)} kg
                                    </TableCell>
                                    <TableCell>
                                        {new Date(sale.appointment_date).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={sale.sale_status.toString()}
                                            onValueChange={(value) => handleStatusChange(sale.sale_id, parseInt(value))}
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
                                    <TableCell>
                                        <Button variant="outline" onClick={() => openModal(sale.sale_id)}>Detail</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            <SaleDetailsModal isOpen={isModalOpen} onClose={closeModal} saleId={selectedSaleId} />
        </div>
    );
}
