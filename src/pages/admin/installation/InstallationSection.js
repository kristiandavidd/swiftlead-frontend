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
import InstallationDetailModal from "@/components/InstallationDetailModal";
import AddDeviceModal from "@/components/AddDevicemodal";
import { set } from "react-hook-form";

const statusOptions = [
    { value: 0, label: "Pending" },
    { value: 1, label: "Checking" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Completed" },
    { value: 4, label: "Cancelled" },
    { value: 5, label: "Rejected" },
    { value: 6, label: "Rescheduled" },
];

export default function InstallationSection({ setActiveTab }) {
    const [installations, setInstallations] = useState([]);
    const [selectedInstallationId, setSelectedInstallationId] = useState(null); // To manage modal state
    const [selectedInstallation, setSelectedInstallation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalProcessOpen, setIsModalProcessOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchInstallations();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = (saleId) => {
        setSelectedInstallationId(saleId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInstallationId(null);
    };

    const openModalProcess = (installation) => {
        setSelectedInstallation(installation);
        setIsModalProcessOpen(true);
    }

    const closeModalProcess = () => {
        setIsModalProcessOpen(false);
        setSelectedInstallation(null);
    }

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/request/installation/${id}/status`, { status: newStatus });
            toast({ title: "Success", description: "Status updated successfully", variant: "success" });
            fetchInstallations();
        } catch (error) {
            console.error("Error updating installation status:", error);
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    };

    const fetchInstallations = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/request/installation`);
            setInstallations(res.data);
        } catch (error) {
            console.error("Error fetching installations:", error);
            toast({ title: "Error", description: "Failed to fetch installations data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    console.log("data", installations)
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Lokasi RBW</TableHead>
                        <TableHead>Lantai pemasangan</TableHead>
                        <TableHead>Jumlah Sensor</TableHead>
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
                        installations.map((installation) => (
                            <TableRow key={installation.id}>
                                <TableCell>
                                    {installation.user_name}
                                </TableCell>
                                <TableCell>{installation.location}</TableCell>
                                <TableCell>
                                    {installation.floors}
                                </TableCell>
                                <TableCell>
                                    {installation.sensor_count}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={installation.status.toString()}
                                        onValueChange={(value) => handleStatusChange(installation.id, parseInt(value))}
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
                                        onClick={() => openModal(installation.id)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => openModalProcess(installation)}
                                    >
                                        Process
                                    </Button>

                                </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <InstallationDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                installationId={selectedInstallationId}
            />
            <AddDeviceModal
                isOpen={isModalProcessOpen}
                onClose={closeModalProcess}
                setActiveTab={setActiveTab}
                requestData={selectedInstallation}
                onSuccess={fetchInstallations}
            />

        </div>
    )
}