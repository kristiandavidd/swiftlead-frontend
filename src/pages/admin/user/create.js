"use client";

import AdminLayout from "@/layout/AdminLayout";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateUser() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        no_telp: '',
        location: '',
        role: 0,
        status: -1,
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

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
            await axios.post(`${apiUrl}/user`, formData);
            toast({ title: "Sukses!", description: "Berhasil Menambahkan pengguna baru.", variant: "success" });
            router.push('/admin/user');
        } catch (err) {
            console.error("Error creating user:", err);
            toast({ title: "Galat!", description: "Gagal Menambahkan pengguna baru.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container w-2/3 p-4 mx-auto bg-white rounded shadow">

                <h1 className="mb-4 text-2xl font-bold">Tambahkan Pengguna</h1>
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
                    <div>
                        <label htmlFor="role">Peran</label>
                        <Select
                            value={formData.role.toString()}
                            onValueChange={(value) => setFormData({ ...formData, role: parseInt(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="0">Peternak Walet</SelectItem>
                                    <SelectItem value="1">Admin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <Button onClick={() => router.push("/admin/user")} variant="outline">Batal</Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Menambahkan...' : 'Tambahkan Pengguna'}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
