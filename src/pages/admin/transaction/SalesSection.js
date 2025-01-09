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

const statusOptions = [
    { value: 0, label: "Submission" },
    { value: 1, label: "Checking" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Cmpleted" },
    { value: 4, label: "Cancelled" },
    { value: 5, label: "Rejected" },
    { value: 6, label: "Rescheduled" },
];

export default function AdminSalesPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSaleId, setSelectedSaleId] = useState(null); // To manage modal state
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
            toast({ title: "Error", description: "Failed to fetch sales data", variant: "destructive" });
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
            toast({ title: "Success", description: "Sale status updated successfully", variant: "success" });
            fetchSales(); // Refresh the sales data
        } catch (error) {
            console.error("Error updating sale status:", error);
            toast({ title: "Error", description: "Failed to update sale status", variant: "destructive" });
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
                        <TableHead>Province</TableHead>
                        <TableHead>Price (IDR)</TableHead>
                        <TableHead>Total Qty</TableHead>
                        <TableHead>Appointment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan="5" className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : (
                        sales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{sale.province}</TableCell>
                                <TableCell>
                                    {parseFloat(sale.price).toLocaleString("id-ID", {
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
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={sale.status.toString()}
                                        onValueChange={(value) => handleStatusChange(sale.id, parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
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
                                    <Button onClick={() => openModal(sale.id)}>View Details</Button>
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
