import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";

export default function MaintenanceDetailModal({ isOpen, onClose, maintenanceId }) {
    const [maintenance, setMaintenance] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const statusMapping = {
        0: 'Menunggu',
        1: 'Pengecekan',
        2: 'Disetujui',
        3: 'Selesai',
        4: 'Dibatalkan',
        5: 'Ditolak',
        6: "Dijadwalkan Ulang"
    };

    useEffect(() => {
        if (isOpen && maintenanceId) {
            fetchMaintenanceDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, maintenanceId]);

    const fetchMaintenanceDetail = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/request/maintenance/${maintenanceId}`);
            setMaintenance(res.data);
        } catch (error) {
            console.error("Error fetching maintenance details:", error);
            toast({ title: "Galat!", description: "Gagal mendapatkan detail maintenance.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-4 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Pengajuan Pemeliharaan</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Spinner />
                    </div>
                ) : maintenance ? (
                    <div className="table w-full">
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Nama Peternak</div>
                            <div className="table-cell text-muted-foreground">{maintenance.user_name}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Lokasi Kandang</div>
                            <div className="table-cell text-muted-foreground">{maintenance.location}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Lantai yang dipasang</div>
                            <div className="table-cell text-muted-foreground">{maintenance.floors}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Alasan Pemeliharaan</div>
                            <div className="table-cell text-muted-foreground">{maintenance.reason}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Tanggal janji temu</div>
                            <div className="table-cell text-muted-foreground">
                                {new Date(maintenance.appointment_date).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell w-2/5 py-1">Status</div>
                            <div className="table-cell text-muted-foreground">{statusMapping[maintenance.status]}</div>
                        </div>
                    </div>
                ) : (
                    <p>Detail pemeliharaan tidak ditemukan.</p>
                )}
                <Button variant="outline" onClick={onClose} className="mt-4">
                    Tutup
                </Button>
            </DialogContent>
        </Dialog>
    );
}