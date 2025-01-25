"use client";

import AdminLayout from "@/layout/AdminLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";

export default function EditUser() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        no_telp: '',
        location: '',
        role: 0,
        status: 0,
    });
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false); // Cek apakah komponen berjalan di client
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        setIsClient(true); // Menandai bahwa komponen berjalan di sisi client
    }, []);

    useEffect(() => {
        if (isClient && params?.id) {
            fetchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient, params?.id]);

    const fetchUser = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/user/${params.id}`);
            const userData = res.data[0];

            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                no_telp: userData.no_telp || '',
                location: userData.location || '',
                role: userData.role || 0,
                status: userData.status || 0,
            });
        } catch (err) {
            console.error("Error fetching user:", err);
            toast({ title: "Galat!", description: "Gagal mendapatkan data pengguna.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            setLoading(true);
            await axios.put(`${apiUrl}/user/${params.id}`, formData);
            toast({ title: "Sukses!", description: "Berhasil memperbarui data pengguna.", variant: "success" });
            router.push('/admin/user');
        } catch (err) {
            console.error("Error updating user:", err);
            toast({ title: "Galat!", description: "Gagal memperbarui data pengguna.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (!isClient || !params?.id) {
        return (
            <AdminLayout>
                <div className="container w-2/3 p-4 mx-auto bg-white rounded shadow">
                    <Spinner />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container w-2/3 p-4 mx-auto bg-white rounded shadow">
                <h1 className="mb-4 text-2xl font-bold">Perbarui Pengguna</h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name">Nama</label>
                        <Input
                            placeholder="Nama"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Input
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="no_telp">Nomor Telepon</label>
                        <Input
                            placeholder="628.."
                            name="no_telp"
                            value={formData.no_telp}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Alamat</label>
                        <Input
                            placeholder="Alamat"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex w-full gap-4">
                        <div className="w-1/2">
                            <label htmlFor="role">Peran</label>
                            <Select
                                value={formData.role.toString()}
                                onValueChange={(value) => setFormData({ ...formData, role: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="0">Peternak Walet</SelectItem>
                                        <SelectItem value="1">Admin</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="status">Status</label>
                            <Select
                                value={formData.status.toString()}
                                onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="-1">Tidak Aktif</SelectItem>
                                        <SelectItem value="0">Aktif</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <Button variant="outline" onClick={() => router.push("/admin/user")}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Memperbarui...' : 'Perbarui Pengguna'}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
