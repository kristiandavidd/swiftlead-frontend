"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

export default function SaleDetailsModal({ isOpen, onClose, saleId }) {
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;
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
        if (isOpen && saleId) {
            fetchSaleDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, saleId]);

    const fetchSaleDetails = async () => {

        try {
            const res = await axios.get(`${apiUrl}/sales/${saleId}`);
            setSale(res.data);
        } catch (error) {
            console.error("Error fetching sale details:", error);
            toast({
                title: "Galat!",
                description: "Gagal mendapatkan detail penjualan.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-4 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Penjualan</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Spinner />
                    </div>
                ) : sale ? (
                    <div className="space-y-4">
                        <div>
                            {sale.proof_photo ? (
                                <Image
                                    src={`${apiUrl}${sale.proof_photo}`}
                                    alt="Proof"
                                    width={200}
                                    height={200}
                                    className="mx-auto my-2 "
                                />
                            ) : (
                                "Tidak ada foto."
                            )}
                        </div>
                        <div className="table w-full">
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Provinsi</div>
                                <div className="table-cell text-muted-foreground"> {sale.province}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Harga acuan</div>
                                <div className="table-cell text-muted-foreground">
                                    {parseFloat(sale.price).toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Jumlah berbentuk mangkok</div>
                                <div className="table-cell text-muted-foreground">{sale.bowl_weight} kg </div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Jumlah berbentuk oval</div>
                                <div className="table-cell text-muted-foreground">{sale.oval_weight} kg</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Jumlah berbentuk sudut</div>
                                <div className="table-cell text-muted-foreground">{sale.corner_weight} kg</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Jumlah berbentuk patahan</div>
                                <div className="table-cell text-muted-foreground">{sale.broken_weight} kg</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Tanggal janji temu</div>
                                <div className="table-cell text-muted-foreground">
                                    {new Date(sale.appointment_date).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="table w-full">
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Total Berat Sarang</div>
                                <div className="table-cell text-muted-foreground">{(sale.bowl_weight + sale.oval_weight + sale.corner_weight + sale.broken_weight)} kg</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Total Harga</div>
                                <div className="table-cell text-muted-foreground">
                                    {parseFloat(sale.price * (sale.bowl_weight + sale.oval_weight + sale.corner_weight + sale.broken_weight)).toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell w-3/5 py-1">Status</div>
                                <div className="table-cell text-muted-foreground">{statusMapping[sale.status]}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Detail penjualan tidak ditemukan.</p>
                )}
                <Button variant="outline" onClick={onClose} className="mt-4">
                    Tutup
                </Button>
            </DialogContent>
        </Dialog>
    );
}
