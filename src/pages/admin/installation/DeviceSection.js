import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import axios from "axios";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { toast } from "@/hooks/use-toast";
import EditDeviceModal from "@/components/EditDeviceModal";

export default function Installation() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const statusOptions = [
        { value: 0, label: "Tidak Aktif" },
        { value: 1, label: "Aktif" },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    const openEditModal = async (id) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/device/${id}`);
            setSelectedDevice(res.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching device data:", error);
            toast({
                title: "Galat!",
                description: "Gagal mengambil data perangkat user.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchDevice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDevice = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/device`);
            setDevices(res.data);
        } catch (error) {
            console.error("Error fetching device:", error);
            toast({ title: "Galat!", description: "Gagal mengambil data perangkat.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/device/update/${id}/status`, {
                status: newStatus,
            });
            toast({ title: "Sukses!", description: "Berhasil memperbarui status perangkat.", variant: "success" });
            fetchDevice();
        } catch (error) {
            console.error("Error updating device status:", error);
            toast({ title: "Galat!", description: "Gagal memperbarui status perangkat.", variant: "destructive" });
        }
    }

    const handleDeleteDevice = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.delete(`${apiUrl}/device/delete/${selectedDeviceId}`);
            setSelectedDevice(null)
            toast({ title: "Sukses!", description: "Perangkat berhasil dihapus.", variant: "success" });
            fetchDevice();
        } catch (error) {
            console.error("Error deleting device:", error);
            toast({ title: "Galat!", description: "Gagal menghapus perangkat.", variant: "destructive" });
        }
    }

    return (
        <div >
            <Table >
                <TableHeader>
                    <TableRow>
                        <TableHead>Kode instal</TableHead>
                        <TableHead>Pemilik RBW</TableHead>
                        <TableHead>Lantai</TableHead>
                        <TableHead>Tanggal Pemasangan</TableHead>
                        <TableHead>Terakhir Maintenance</TableHead>
                        <TableHead>Status Perangkat</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan="7" className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : (
                        devices.map((device) => (
                            <TableRow key={device.id} >
                                <TableCell>{device.install_code}</TableCell>
                                <TableCell>
                                    {device.user_name}
                                </TableCell>
                                <TableCell>
                                    {device.floor}
                                </TableCell>
                                <TableCell>
                                    {new Date(device.created_at).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    {new Date(device.updated_at).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={device.status.toString()}
                                        onValueChange={(value) => handleStatusChange(device.id, parseInt(value))}
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
                                <TableCell className="flex items-center gap-2">
                                    <Button size="sm" onClick={() => openEditModal(device.id)}>
                                        <IconPencil size={16} />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive" onClick={() => setSelectedDeviceId(device.id)}>
                                                <IconTrash size={16} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                                                <AlertDialogDescription>Aksi ini tidak bisa dikembalikan.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteDevice}>Hapus</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <EditDeviceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDevice={selectedDevice}
                onSuccess={fetchDevice}
            />;
        </div>
    )
}