import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { IconInfoCircle } from "@tabler/icons-react";

export default function RequestUninstallationModal({ isOpen, onClose, deviceData, houseNameData }) {
    const [reason, setReason] = useState("");
    const [houseName, setHouseName] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [floor, setFloor] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (deviceData) {
            setHouseName(houseNameData || "");
            setFloor(deviceData.floor || "");
        }
    }, [deviceData, houseNameData]);  // Menambahkan house sebagai dependency untuk update state

    const handleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.post(`${apiUrl}/request/uninstallation`, {
                id_device: deviceData.id,
                appointment_date: appointmentDate,
                reason,
            });

            toast({
                title: "Sukses!",
                description: "Pengajuan uninstalasi berhasil dibuat.",
                variant: "success",
            });
            onClose();
        } catch (error) {
            console.error("Error submitting uninstallation request:", error);
            toast({
                title: "Galat!",
                description: "Gagal membuat pengajuan uninstalasi.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Pengajuan Uninstalasi Perangkat</DialogTitle>
                <div className="space-y-4">
                    <div className="table w-full">
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Nama kandang</div>
                            <div className="table-cell text-muted-foreground">{houseName}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Lantai</div>
                            <div className="table-cell text-muted-foreground">{floor}</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <label>Pilih tanggal temu uninstalasi</label>
                            <p className='flex items-center gap-1 text-sm text-muted-foreground'><IconInfoCircle size={16}></IconInfoCircle> Buatlah janji di hari dan di jam kerja.</p>
                        </div>
                        <Input
                            type="date"
                            placeholder="Select appointment date"
                            min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label>Alasan uninstalasi perangkat</label>
                        <Input
                            type="text"
                            placeholder="Jelaskan alasan sedetail mungkin"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
