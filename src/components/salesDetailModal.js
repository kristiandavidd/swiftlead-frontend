"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";

export default function SaleDetailsModal({ isOpen, onClose, saleId }) {
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    const statusMapping = {
        0: 'Pending',
        1: 'Checking',
        2: 'Approved',
        3: 'Completed',
        4: 'Cancelled',
        5: 'Rejected',
        6: "Rescheduled"
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-4 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Sale Details</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <p>Loading...</p>
                ) : sale ? (
                    <div className="space-y-4">
                        <div>
                            <strong>Province:</strong> {sale.province}
                        </div>
                        <div>
                            <strong>Price:</strong>{" "}
                            {parseFloat(sale.price).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            })}
                        </div>
                        <div>
                            <strong>Bowl Weight:</strong> {sale.bowl_weight} kg
                        </div>
                        <div>
                            <strong>Oval Weight:</strong> {sale.oval_weight} kg
                        </div>
                        <div>
                            <strong>Corner Weight:</strong> {sale.corner_weight} kg
                        </div>
                        <div>
                            <strong>Broken Weight:</strong> {sale.broken_weight} kg
                        </div>
                        <div>
                            <strong>Appointment Date:</strong>{" "}
                            {new Date(sale.appointment_date).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </div>
                        <div>
                            <strong>Status:</strong> {statusMapping[sale.status]}
                        </div>
                        <div>
                            <strong>Proof Photo:</strong>
                            {sale.proof_photo ? (
                                <Image
                                    src={`${apiUrl}${sale.proof_photo}`}
                                    alt="Proof"
                                    width={200}
                                    height={200}
                                    className="mt-2"
                                />
                            ) : (
                                "No Photo"
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Sale details not found.</p>
                )}
                <Button onClick={onClose} className="mt-4">
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
}
