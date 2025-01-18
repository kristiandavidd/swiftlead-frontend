import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const RequestUninstallationModal = ({ isOpen, onClose, deviceData, houseNameData }) => {
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
                title: "Success",
                description: "Uninstallation request submitted successfully.",
                variant: "success",
            });
            onClose();
        } catch (error) {
            console.error("Error submitting uninstallation request:", error);
            toast({
                title: "Error",
                description: "Failed to submit uninstallation request.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Request Uninstallation</DialogTitle>
                <div className="space-y-4">
                    <div>
                        <strong>House:</strong> {houseName}
                    </div>
                    <div>
                        <strong>Floor:</strong> {floor}
                    </div>
                    <Input
                        type="date"
                        placeholder="Select appointment date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Enter reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RequestUninstallationModal;
