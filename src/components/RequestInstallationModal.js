import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { IconInfoCircle } from "@tabler/icons-react";
import { useUser } from "@/context/userContext";
import Link from "next/link";

export default function RequestInstallationModal({ houses, onClose, isOpen }) {
    const [selectedHouse, setSelectedHouse] = useState("");
    const [selectedFloors, setSelectedFloors] = useState("");
    const [sensorCount, setSensorCount] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const { user } = useUser();
    const { toast } = useToast();

    const handleFloorChange = (e) => {
        const value = e.target.value;
        if (/^[0-9,]*$/.test(value)) {
            setSelectedFloors(value);
        }
    };

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
                toast({
                    title: "Sukses!",
                    description: "Pengajuan instalasi berhasil dibuat.",
                    variant: "success",
                });

                setSelectedHouse("");
                setSelectedFloors("");
                setSensorCount("");
                setAppointmentDate("");
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

                {/* Cek jika user belum melengkapi profil */}
                {(!user?.no_telp || !user?.location) ? (
                    <div className="p-4 text-center rounded-md bg-tersier">
                        <p className="font-semibold text-red-600">Lengkapi Profil Anda</p>
                        <p className="mt-2 text-sm text-gray-600">Silakan tambahkan informasi nomor telepon dan lokasi di profil Anda.</p>
                        <div className="mt-4">
                            <Link href="/profile">
                                <Button>Lengkapi Profil</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    Object.keys(houses).length > 0 ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label>Pilih kandang</label>
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
                                <label>Pilih lantai mana saja yang akan diinstal</label>
                                <Input
                                    type="text"
                                    placeholder="1, 2, 3"
                                    value={selectedFloors}
                                    onChange={handleFloorChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label>Masukkan jumlah sensor</label>
                                <Input
                                    type="number"
                                    placeholder="Jumlah sensor"
                                    value={sensorCount}
                                    onChange={(e) => setSensorCount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <label>Pilih tanggal janji temu</label>
                                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <IconInfoCircle size={16} /> Buatlah janji di hari dan di jam kerja.
                                    </p>
                                </div>
                                <Input
                                    type="date"
                                    placeholder="Tanggal janji temu"
                                    value={appointmentDate}
                                    min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={onClose}>Batal</Button>
                                {houses && (
                                    <Button onClick={handleSubmit}>Kirim</Button>
                                )}
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="p-4 text-center rounded-md bg-tersier">
                            <p className="font-semibold text-red-600">Anda Melum Memiliki Kandang</p>
                            <p className="mt-2 text-sm text-gray-600">Silakan tambahkan kandang terlebih dahulu.</p>
                            <div className="mt-4">
                                <Button onClick={onClose}>Kembali</Button>
                            </div>
                        </div>
                    )
                )}
            </DialogContent>
        </Dialog>
    );
};
