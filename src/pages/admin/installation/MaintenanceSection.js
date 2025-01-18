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
import AddDeviceModal from "@/components/AddDevicemodal";
import { set } from "react-hook-form";
import MaintenanceDetailModal from "@/components/MaintenanceDetailModal";

const statusOptions = [
    { value: 0, label: "Pending" },
    { value: 1, label: "Checking" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Completed" },
    { value: 4, label: "Cancelled" },
    { value: 5, label: "Rejected" },
    { value: 6, label: "Rescheduled" },
];

export default function MaintenanceSection({ setActiveTab }) {
    const [maintenances, setMaintenances] = useState([]);
    const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null); // To manage modal state
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalProcessOpen, setIsModalProcessOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchMaintenances();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = (saleId) => {
        setSelectedMaintenanceId(saleId);
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
            toast({ title: "Success", description: "Status updated successfully", variant: "success" });
            fetchMaintenances();
        } catch (error) {
            console.error("Error updating maintenance status:", error);
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
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
            toast({ title: "Error", description: "Failed to fetch maintenances data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Lokasi RBW</TableHead>
                        <TableHead>Lantai maintenance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan="5" className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : (
                        maintenances.map((maintenance) => (
                            <TableRow key={maintenance.id}>
                                <TableCell>
                                    {maintenance.user_name}
                                </TableCell>
                                <TableCell>{maintenance.location}</TableCell>
                                <TableCell>
                                    {maintenance.floors}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={maintenance.status.toString()}
                                        onValueChange={(value) => handleStatusChange(maintenance.id, parseInt(value))}
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
                                <TableCell className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openModal(maintenance.id)}
                                    >
                                        Details
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <MaintenanceDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                maintenanceId={selectedMaintenanceId}
            />

        </div>
    )
}