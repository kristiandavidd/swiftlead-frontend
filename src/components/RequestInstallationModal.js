import { use, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { IconInfoCircle } from "@tabler/icons-react";

export default function RequestInstallationModal({ houses, onClose, isOpen }) {
    const [selectedHouse, setSelectedHouse] = useState("");
    const [selectedFloors, setSelectedFloors] = useState("");
    const [sensorCount, setSensorCount] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
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
                appointment_date: appointmentDate,
            })
            .then((response) => {
                console.log("Installation request submitted:", response.data);

                toast({
                    title: "Sukses!",
                    description: "Pengajuan instalasi berhasil dibuat.",
                    variant: "success",
                });

                setSelectedHouse("");
                setSelectedFloors("");
                setSensorCount("");
                setAppointmentDate(""); 
                setActiveTab("management");
                onClose(true);

            })
            .catch((error) => {
                toast({
                    title: "Galat!",
                    description: error.response?.data?.message || "Gagal membuat pengajuan instalasi.",
                    variant: "destructive",
                });
                console.error("Error submitting installation request:", error.response?.data || error.message);
            });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Ajukan Instalasi Perangkat Baru</DialogTitle>
                {Object.keys(houses).length > 0 ? (

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label for="">Pilih kandang </label>
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
                        </div>
                        <div className="space-y-2">
                            <label for="">Pilih lantai mana saja yang akan diinstal </label>
                            <Input
                                type="text"
                                placeholder='1, 2, 3'
                                value={selectedFloors}
                                onChange={(e) => setSelectedFloors(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label for="">Masukkan jumlah sensor </label>
                            <Input
                                type="number"
                                placeholder="Jumlah sensor"
                                value={sensorCount}
                                onChange={(e) => setSensorCount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div>
                                <label for="">Pilih tanggal janji temu </label>
                                <p className='flex items-center gap-1 text-sm text-muted-foreground'><IconInfoCircle size={16}></IconInfoCircle> Buatlah janji di hari dan di jam kerja.</p>
                            </div>
                            <Input
                                type="date"
                                placeholder="Tanggal janji temu"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (

                    <p className="p-4 space-y-4 text-center rounded-md bg-tersier">Kandang belum tersedia. Silahkan tambahkan kandang terlebih dahulu.</p>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    {houses && (
                        <Button onClick={handleSubmit}>Kirim</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
