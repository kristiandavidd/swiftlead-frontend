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
            toast({ title: "Success", description: "User created successfully", variant: "success" });
            router.push('/admin/user');
        } catch (err) {
            console.error("Error creating user:", err);
            toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container w-2/3 p-4 mx-auto bg-white rounded shadow">

                <h1 className="mb-4 text-2xl font-bold">Create User</h1>
                <div className="space-y-4">

                    <div>
                        <label htmlFor="name">Name</label>
                        <Input
                            placeholder="Name"
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
                        <label htmlFor="no_telp">Phone Number</label>
                        <Input
                            placeholder="Phone"
                            name="no_telp"
                            value={formData.no_telp}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Location</label>
                        <Input
                            placeholder="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="role">Role</label>
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
                    </div>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create User'}
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
