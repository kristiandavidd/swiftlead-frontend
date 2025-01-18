import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";


export default function UninstallationDetailModal({ isOpen, onClose, uninstallationId }) {
    const [uninstallation, setUninstallation] = useState(null);
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-4 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Installation Details</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <p>Loading...</p>
                ) : uninstallation ? (
                    <div className="space-y-4">
                        <div>
                            <strong>Nama Peternak:</strong> {uninstallation.user_name}
                        </div>
                        <div>
                            <strong>Lokasi Kandang:</strong> {uninstallation.location}
                        </div>
                        <div>
                            <strong>Lantai yang dipasang:</strong> {uninstallation.floors}
                        </div>
                        <div>
                            <strong>Alasan:</strong> {uninstallation.reason}
                        </div>
                        <div>
                            <strong>Status:</strong> {statusMapping[uninstallation.status]}
                        </div>
                    </div>
                ) : (
                    <p>Uninstallation details not found.</p>
                )}
                <Button onClick={onClose} className="mt-4">
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
}