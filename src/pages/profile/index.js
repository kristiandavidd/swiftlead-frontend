import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layout/UserLayout';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { IconPencil, IconUserCircle } from '@tabler/icons-react';
import axios from 'axios';
import { useUser } from '@/context/userContext';
import Image from 'next/image';
import { get, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Spinner from '@/components/ui/spinner';

export default function Profile() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { toast } = useToast()
    const [isActive, setIsActive] = useState(null);
    const router = useRouter();
    const { user, setUser } = useUser();
    const [membership, setMembership] = useState(null);
    console.log("user", user);

    // State untuk form
    const [formData, setFormData] = useState({
        name: user?.name || '',
        no_telp: user?.no_telp || '',
        location: user?.location || ''
    });


    // Fungsi untuk menangani perubahan input
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleLogout = async () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleEditProfile = async () => {
        try {
            const apiUrl = process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            const updatedData = {};
            if (formData.name) updatedData.name = formData.name;
            if (formData.no_telp) updatedData.no_telp = formData.no_telp;
            if (formData.location) updatedData.location = formData.location;

            if (Object.keys(updatedData).length === 0) {
                toast({
                    title: "No Changes",
                    description: "No fields to update",
                    variant: "destructive",
                });
                return;
            }

            const res = await axios.put(`${apiUrl}/profile/update`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                setUser((prevUser) => ({
                    ...prevUser,
                    ...res.data.user,
                }));

                toast({
                    title: "Success",
                    description: "Profile updated successfully!",
                    variant: "success",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update profile",
                variant: "destructive",
            });
        }
    };



    const getStatusMember = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;
        try {
            const userId = user.id;
            console.log(userId);
            const { data } = await axios.get(`${apiUrl}/membership/user/${userId}`);
            setIsActive(data.isActive);
            setMembership(data.membership);
            console.log(data);
        } catch (error) {
            console.error('Error fetching membership status:', error);
            setIsActive(false); // Jika terjadi error, anggap user tidak aktif
        }
    };

    console.log("membership", membership);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                no_telp: user.no_telp || '',
                location: user.location || '',
            });
        }
        getStatusMember();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <UserLayout head={"Profile"}>
            <div className="flex flex-col w-full">
                <p className="text-lg font-semibold">Profil</p>
                <p className="text-sm">Personalisasi akun anda serta bergabunglah bersama membership!</p>
            </div>
            <Card className="p-4 my-4">
                <CardContent className="flex">
                    {user && (
                        <div className="flex items-center w-full gap-6 py-6">
                            <div className="flex flex-col w-1/2 gap-8">
                                <div className="flex flex-col items-center w-full gap-2">
                                    <Avatar className="w-20 h-20">
                                        {user.img_profile ? (
                                            <AvatarImage src={user.img_profile} />
                                        ) : (
                                            <AvatarFallback>
                                                <IconUserCircle size={80} stroke={1.2} className="text-gray-400" />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="gap-4 text-center">
                                        <p className="text-lg font-bold">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Button size="sm" className="text-sm bg-white border border-primary text-primary hover:bg-muted">Ganti Foto</Button>
                                    <Button size="sm" className="text-sm bg-white border border-destructive text-destructive hover:bg-muted">Hapus Foto</Button>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between w-1/2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Nama anda.."
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">Nama diperlukan.</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="no_telp">Nomor Telepon</Label>
                                    <Input
                                        type="text"
                                        id="no_telp"
                                        placeholder="Nomor Telepon anda.."
                                        value={formData.no_telp}
                                        onChange={handleInputChange}
                                    />
                                    {errors.no_telp && <p className="text-sm text-red-500">Nomor Telepon diperlukan.</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="location">Alamat</Label>
                                    <Input
                                        type="text"
                                        id="location"
                                        placeholder="Alamat anda.."
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                    {errors.location && <p className="text-sm text-red-500">Alamat diperlukan.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                    <Button onClick={handleLogout} className="bg-white border border-primary text-primary hover:bg-muted">Keluar</Button>
                    <Button onClick={handleEditProfile}>Simpan</Button>
                </CardFooter>
            </Card>
            <Card className="flex items-center justify-center p-8 my-4">
                <CardHeader className="flex flex-col w-1/2 gap-4">
                    {isActive === null ? (
                        <div className="flex items-center justify-center h-32">
                            <Spinner />
                        </div>
                    ) : isActive ? (
                        <div className='flex flex-col gap-4'>
                            <div>
                                <CardTitle className='text-lg font-bold'>Nikmati Konten Premium Anda!</CardTitle>
                                <CardDescription>Anda adalah peternak kelas atas, Terus naik level!</CardDescription>
                            </div>
                            <Link href="/member">
                                <Button className="px-8 py-2 w-fit">
                                    Beranda Member
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4'>
                            <div>
                                <CardTitle className='text-lg font-bold'>Bergabung dan Dapatkan Konten Premium!</CardTitle>
                                <CardDescription>Akses berbagai konten menarik yang hanya dimiliki oleh peternak kelas atas.</CardDescription>
                            </div>
                            <Link href="/member/register">
                                <Button className="px-8 py-2 w-fit">
                                    Bergabung Sekarang!
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="w-1/2 p-0 px-6">
                    <Card className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate">
                        <CardHeader className="flex flex-col justify-between h-36">
                            <Image alt="Membership" src="/images/logo_transparent.png" width={100} height={100} />
                            <CardDescription className="text-white">
                                <p>{membership ? membership.order_id : "MEM-1732372442611"}</p>
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between p-4 text-white rounded-b-lg bg-slate-700">
                            <p>{user?.name}</p>
                            <p>
                                <span className="text-muted-foreground">Exp</span>{" "}
                                {membership
                                    ? new Intl.DateTimeFormat("id-ID", {
                                        month: "2-digit",
                                        year: "2-digit",
                                    }).format(new Date(membership.exp_date))
                                    : "18/26"}
                            </p>
                        </CardFooter>
                    </Card>
                </CardContent>
            </Card>
        </UserLayout >
    );
}
