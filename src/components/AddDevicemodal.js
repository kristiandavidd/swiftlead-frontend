"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function AddDeviceModal({ isOpen, onClose, requestData, onSuccess, setActiveTab }) {
    const [floor, setFloor] = useState("");
    const [installCode, setInstallCode] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (requestData) {
            generateInstallCode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestData]);

    const generateInstallCode = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.get(`${apiUrl}/device/generate-code`);
            setInstallCode(response.data.install_code);
            console.log("response", response);
        } catch (error) {
            console.error("Error generating install code:", error);
            toast({
                title: "Error",
                description: "Failed to generate install code.",
                variant: "destructive",
            });
        }
    };


    const handleSubmit = async () => {
        if (!floor) {
            toast({
                title: "Error",
                description: "Floor is required.",
                variant: "destructive",
            });
            return;
        }

        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.post(`${apiUrl}/device`, {
                id_swiftlet_house: requestData.id_swiftlet_house,
                floor,
                install_code: installCode,
                status: 1,
            });

            toast({
                title: "Success",
                description: "Device added successfully.",
                variant: "success",
            });

            onSuccess();
            onClose();
            setActiveTab("devices");
        } catch (error) {
            console.error("Error adding device:", error);
            toast({
                title: "Error",
                description: "Failed to add device.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Device</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <strong>House Name:</strong> {requestData?.house_name || "N/A"}
                    </div>
                    <div>
                        <strong>Location:</strong> {requestData?.location || "N/A"}
                    </div>
                    <div>
                        <strong>Install Code:</strong> {installCode}
                    </div>
                    <Input
                        type="number"
                        placeholder="Enter Floor"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
