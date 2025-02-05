/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/userContext";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";

export default function HarvestPage() {
    const [floorCount, setFloorCount] = useState(1); // Jumlah lantai awal = 1
    const [isPostHarvest, setIsPostHarvest] = useState(false); // Apakah sudah submit ke post-harvest
    const [floorData, setFloorData] = useState([0]); // Set default 10 sarang per lantai
    const [postHarvestData, setPostHarvestData] = useState([]); // Data untuk post-harvest
    const { user } = useUser();
    const router = useRouter();
    const { houseId } = router.query;
    const { toast } = useToast();
    
    const shapeLabels = {
        bowl: "Mangkok",
        oval: "Oval",
        corner: "Sudut",
        fracture: "Patahan",
    };


    const [swiftletHouse, setSwiftletHouse] = useState({});
    const [formData, setFormData] = useState({
        userId: user?.id || "",
        swiftletHouseId: houseId || "",
        floorData: floorData,
        postHarvestData: postHarvestData
    });

    useEffect(() => {
        if (houseId) {
            fetchSwiftletHouse(houseId);
        }
    }, [houseId]);

    useEffect(() => {
        // Update formData when postHarvestData or floorData changes
        setFormData((prev) => ({
            ...prev,
            floorData: floorData,
            postHarvestData: postHarvestData,
        }));
    }, [postHarvestData, floorData]);

    const fetchSwiftletHouse = async (houseId) => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/device/house/${houseId}`);
            setSwiftletHouse(res.data);
        } catch (error) {
            console.error("Error fetching swiftlet house:", error);
            toast({ title: "Galat!", description: "Gagal mengambil data kandang.", variant: "destructive" });
        }
    };

    const handleClickerChange = (floorIndex, value) => {
        setFloorData((prevData) => {
            const newData = [...prevData];
            newData[floorIndex] = Math.max(0, newData[floorIndex] + value); // Menambahkan sarang atau mengurangi
            return newData;
        });
    };

    const handleAddFloor = () => {
        setFloorCount(floorCount + 1);
        setFloorData([...floorData, 0]); // Menambah lantai baru dengan 10 sarang default
    };

    const handleSubmit = () => {
        setIsPostHarvest(true);
        const initialPostHarvestData = floorData.map(() => ({
            bowl: { weight: "", pieces: "" },
            oval: { weight: "", pieces: "" },
            corner: { weight: "", pieces: "" },
            fracture: { weight: "", pieces: "" }
        }));
        setPostHarvestData(initialPostHarvestData);
    };

    const handlePostHarvestChange = (floorIndex, shape, field, value) => {
        setPostHarvestData((prevData) => {
            const newData = [...prevData];

            // Jika lantai belum ada di array, buat objek baru dengan default struktur
            if (!newData[floorIndex]) {
                newData[floorIndex] = {
                    bowl: { weight: "", pieces: "" },
                    oval: { weight: "", pieces: "" },
                    corner: { weight: "", pieces: "" },
                    fracture: { weight: "", pieces: "" }
                };
            }

            // Pastikan objek bentuk sudah ada sebelum mengaksesnya
            if (!newData[floorIndex][shape]) {
                newData[floorIndex][shape] = { weight: "", pieces: "" };
            }

            // Set nilai yang dimasukkan oleh pengguna
            newData[floorIndex][shape][field] = value;

            return newData;
        });
    };


    const handleSubmitHarvest = async () => {
        const { userId, swiftletHouseId, postHarvestData } = formData;

        const isDataValid = postHarvestData.every(floor => {
            return Object.values(floor).every(shape => shape.weight && shape.pieces);
        });

        if (!userId || !swiftletHouseId || !isDataValid) {
            console.log(userId, swiftletHouseId, postHarvestData);
            toast({ title: "Galat!", description: "Data panen tidak valid.", variant: "destructive" });
            console.log(formData);
            return;
        }

        try {
            const apiUrl = process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            const response = await axios.post(`${apiUrl}/harvest`, {
                userId,
                swiftletHouseId,
                postHarvestData,
            });

            toast({ title: "Sukses!", description: "Data panen berhasil disimpan.", variant: "success" });
            setFormData({
                userId: "",
                swiftletHouseId: "",
                postHarvestData: [],
            });
            router.push("/harvest");
        } catch (error) {
            console.error("Error submitting harvest data:", error);
            alert("Terjadi kesalahan saat menyimpan data panen.");
        }
    };

    return (
        <UserLayout head="Tambah Panen">
            <div className="w-2/3 p-6 mx-auto">
                <h1 className="mb-4 text-2xl font-bold ">Halaman {!isPostHarvest ? " Pra-panen" : " Pasca-Panen"}</h1>

                {!isPostHarvest ? (
                    <div className="p-6 mx-auto mt-6 bg-white rounded-lg">
                        <p className="text-center">Anda sedang memanen di kandang</p>
                        <h2 className="text-xl font-semibold text-center text-gray-900 ">{swiftletHouse.name}</h2>
                        <div className="flex flex-col items-center mt-4 space-y-4 ">
                            {floorData.map((data, index) => (
                                <div key={index} className="flex flex-col items-center gap-4 p-4 border rounded-lg">
                                    <h3 className="text-lg">Lantai {index + 1}</h3>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={() => handleClickerChange(index, -1)}
                                            variant="outline"
                                            disabled={data <= 0}
                                        >
                                            <IconMinus size={20} />
                                        </Button>
                                        <span className="p-6 text-lg font-semibold text-white rounded-full bg-primary">{data}</span>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleClickerChange(index, 1)}
                                        >
                                            <IconPlus size={20} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between w-full">
                                <Button variant="outline" onClick={() => router.push("/harvest")}>
                                    Batal
                                </Button>
                                <div className="flex items-center justify-end w-full gap-4">

                                    <Button
                                        onClick={handleAddFloor}
                                        variant="outline"
                                    >
                                        Tambah Lantai
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 mt-6 bg-white rounded-lg">
                        <div className="p-4 my-4 bg-gray-100 rounded-md">
                            <h3 className="text-lg font-semibold text-gray-700">Rekomendasi Panen</h3>
                            <p className="text-sm text-gray-500">
                                Berdasarkan data pra-panen, berikut adalah perkiraan jumlah panen Anda (60%-75% dari sarang yang terdeteksi):
                            </p>
                            <div className="mt-4 space-y-2">
                                {floorData.map((count, index) => {
                                    const minRecommendation = Math.floor(count * 0.6);
                                    const maxRecommendation = Math.ceil(count * 0.75);
                                    return (
                                        <div key={index} className="flex items-center justify-between p-2 bg-white border rounded-md">
                                            <span className="font-medium text-gray-600">Lantai {index + 1}</span>
                                            <span className="text-gray-900">
                                                {minRecommendation} - {maxRecommendation} sarang
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mt-4 space-y-4">
                            {floorData.map((data, floorIndex) => (
                                <div key={floorIndex} className="mt-4">
                                    <h3 className="text-lg font-semibold text-center">Lantai {floorIndex + 1}</h3>
                                    {Object.keys(shapeLabels).map((shapeKey) => (
                                        <div key={shapeKey} className="p-4 mt-2 space-y-2 border rounded-lg">
                                            <h4 className="font-medium text-gray-600">
                                                {shapeLabels[shapeKey]}
                                            </h4>
                                            <div className="flex items-center w-full gap-4">
                                                <div className="w-1/2 space-y-2">
                                                    <label>Berat (kg): </label>
                                                    <Input
                                                        type="number"
                                                        value={postHarvestData[floorIndex]?.[shapeKey]?.weight || ""}
                                                        onChange={(e) =>
                                                            handlePostHarvestChange(floorIndex, shapeKey, "weight", e.target.value)
                                                        }
                                                        step="0.1"
                                                        min="0"
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="w-1/2 space-y-2">
                                                    <label>Keping: </label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={postHarvestData[floorIndex]?.[shapeKey]?.pieces || ""}
                                                        onChange={(e) =>
                                                            handlePostHarvestChange(floorIndex, shapeKey, "pieces", e.target.value)
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div className="flex items-center justify-end w-full gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsPostHarvest(false)}
                                >
                                    Kembali
                                </Button>
                                <Button
                                    onClick={handleSubmitHarvest}
                                >
                                    Kirim Hasil Panen
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
