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
import AdminLayout from "@/layout/AdminLayout";
import SaleDetailsModal from "@/components/salesDetailModal";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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

export default function AdminSalesPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSaleId, setSelectedSaleId] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

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
            toast({ title: "Galat!", description: "Gagal mendapatkan data penjualan.", variant: "error" });
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
            toast({ title: "Galat!", description: "Gagal memperbarui status penjualan.", variant: "error" });
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

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
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
                        sales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{sale.province}</TableCell>
                                <TableCell>
                                    {parseFloat(sale.price * (parseFloat(sale.bowl_weight) +
                                        parseFloat(sale.oval_weight) +
                                        parseFloat(sale.corner_weight) +
                                        parseFloat(sale.broken_weight))).toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                </TableCell>
                                <TableCell>
                                    {(
                                        parseFloat(sale.bowl_weight) +
                                        parseFloat(sale.oval_weight) +
                                        parseFloat(sale.corner_weight) +
                                        parseFloat(sale.broken_weight)
                                    ).toFixed(2)}{" "}
                                    kg
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
                                        value={sale.status.toString()}
                                        onValueChange={(value) => handleStatusChange(sale.id, parseInt(value))}
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
                                    <Button variant="outline" onClick={() => openModal(sale.id)}>Detail</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <SaleDetailsModal isOpen={isModalOpen} onClose={closeModal} saleId={selectedSaleId} />
        </div>
    );
}
