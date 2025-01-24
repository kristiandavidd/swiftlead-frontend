import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";

export default function UninstallationDetailModal({ isOpen, onClose, uninstallationId }) {
    const [uninstallation, setUninstallation] = useState(null);
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
        if (isOpen && uninstallationId) {
            fetchUninstallationDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, uninstallationId]);

    const fetchUninstallationDetails = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/request/uninstallation/${uninstallationId}`);
            setUninstallation(res.data);
        } catch (error) {
            console.error("Error fetching uninstallation details:", error);
            toast({ title: "Galat!", description: "Gagal mendapatkan detail uninstalasi.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-4 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Pengajuan Uninstalasi</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Spinner />
                    </div>
                ) : uninstallation ? (
                    <div className="space-y-4">
                        <div className="table w-full">
                            <div className="table-row">
                                <div className="table-cell w-2/5 py-1">Nama Peternak</div>
                                <div className="table-cell text-muted-foreground">{uninstallation.user_name}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-2/5 py-1">Lokasi Kandang</div>
                                <div className="table-cell text-muted-foreground">{uninstallation.location}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-2/5 py-1">Lantai uninstalasi</div>
                                <div className="table-cell text-muted-foreground">{uninstallation.floors}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-2/5 py-1">Lantai</div>
                                <div className="table-cell text-muted-foreground">{uninstallation.reason}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-2/5 py-1">Tanggal janji temu</div>
                                <div className="table-cell text-muted-foreground">
                                    {new Date(uninstallation.appointment_date).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-2/5 py-1">Lantai</div>
                                <div className="table-cell text-muted-foreground">{statusMapping[uninstallation.status]}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Detail uninstalasi tidak ditemukan.</p>
                )}
                <Button variant="outline" onClick={onClose} className="mt-4">
                    Tutup
                </Button>
            </DialogContent>
        </Dialog>
    );
}