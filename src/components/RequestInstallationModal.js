import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const RequestInstallationModal = ({ houses, onClose, isOpen }) => {
    const [selectedHouse, setSelectedHouse] = useState("");
    const [selectedFloors, setSelectedFloors] = useState("");
    const [sensorCount, setSensorCount] = useState("");
    const [appointmentDate, setAppointmentDate] = useState(""); // New state for appointment date
    const [activeTab, setActiveTab] = useState("installation");
    const { toast } = useToast();

    const handleSubmit = () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        axios
            .post(`${apiUrl}/request/installation`, {
                swiftletHouseId: selectedHouse,
                floors: selectedFloors,
                sensorCount: parseInt(sensorCount, 10),
                appointment_date: appointmentDate, // Include appointment date
            })
            .then((response) => {
                console.log("Installation request submitted:", response.data);

                toast({
                    title: "Success",
                    description: "Request installation added successfully.",
                    variant: "success",
                });

                // Close modal and clear inputs
                setSelectedHouse("");
                setSelectedFloors("");
                setSensorCount("");
                setAppointmentDate(""); // Clear appointment date
                setActiveTab("management");
                onClose(true);
                
            })
            .catch((error) => {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to request installation.",
                    variant: "destructive",
                });
                console.error("Error submitting installation request:", error.response?.data || error.message);
            });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Ajukan Instalasi</DialogTitle>
                <div className="space-y-4">
                    {/* Pilihan Kandang */}
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        value={selectedHouse}
                        onChange={(e) => setSelectedHouse(e.target.value)}
                    >
                        <option value="">Pilih Kandang</option>
                        {Object.keys(houses).map((houseId) => (
                            <option key={houseId} value={houseId}>
                                {houses[houseId].name}
                            </option>
                        ))}
                    </select>

                    {/* Input Lantai */}
                    <Input
                        type="text"
                        placeholder='Lantai ("1, 2, 3")'
                        value={selectedFloors}
                        onChange={(e) => setSelectedFloors(e.target.value)}
                    />

                    {/* Input Jumlah Sensor */}
                    <Input
                        type="number"
                        placeholder="Jumlah Sensor"
                        value={sensorCount}
                        onChange={(e) => setSensorCount(e.target.value)}
                    />

                    {/* Input Appointment Date */}
                    <Input
                        type="date"
                        placeholder="Tanggal Appointment"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit}>Kirim</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RequestInstallationModal;
