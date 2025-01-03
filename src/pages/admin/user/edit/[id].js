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
            toast({ title: "Error", description: "Failed to fetch user data", variant: "destructive" });
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
            toast({ title: "Success", description: "User updated successfully", variant: "success" });
            router.push('/admin/user');
        } catch (err) {
            console.error("Error updating user:", err);
            toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (!isClient || !params?.id) {
        return (
            <AdminLayout>
                <p className="text-center">Loading...</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <h1 className="mb-4 text-2xl font-bold">Edit User</h1>
            <div className="space-y-4">
                <Input
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <Input
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Input
                    placeholder="Phone"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleChange}
                />
                <Input
                    placeholder="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
                <Select
                    value={formData.role.toString()}
                    onValueChange={(value) => setFormData({ ...formData, role: parseInt(value) })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="0">User</SelectItem>
                            <SelectItem value="1">Admin</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    value={formData.status.toString()}
                    onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="-1">Inactive</SelectItem>
                            <SelectItem value="0">Active</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Updating...' : 'Update User'}
                </Button>
            </div>
        </AdminLayout>
    );
}
