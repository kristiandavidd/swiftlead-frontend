"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@/context/userContext";
import MemberLayout from "@/layout/MemberLayout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

export default function MemberLandingPage() {
    const { user } = useUser();
    const [membership, setMembership] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchMembership = async () => {
            try {
                const apiUrl =
                    process.env.NODE_ENV === "production"
                        ? process.env.NEXT_PUBLIC_API_PROD_URL
                        : process.env.NEXT_PUBLIC_API_URL;

                const userId = user.id;
                const { data } = await axios.get(`${apiUrl}/membership/user/${userId}`);
                setMembership(data.membership);
            } catch (error) {
                console.error("Error fetching membership data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembership();
    }, [user]);

    return (
        <MemberLayout head="Membership Home">
            <div className="container w-2/3 p-4 mx-auto text-center">
                <h1 className="mb-2 text-2xl font-bold">Selamat Datang, Peternak Walet Premium!</h1>
                <p className="text-muted-foreground">
                    Terima kasih telah bergabung dengan layanan premium kami. Dapatkan kemudahan
                    monitoring kandang walet dan nikmati fitur-fitur unggulan lainnya.
                </p>
            </div>

            <Card className="w-full mx-auto mt-6">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Kartu Member</CardTitle>
                    <CardDescription>
                        Identitas dan masa berlaku keanggotaan Anda di platform kami.
                    </CardDescription>
                </CardHeader>

                {/* Loading spinner saat menunggu data */}
                {loading ? (
                    <div className="flex items-center justify-center p-6">
                        <Spinner />
                    </div>
                ) : (
                    <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                        <div className="w-full space-y-2 text-left sm:w-1/2">
                            <table className="w-full text-left table-auto">
                                <tbody>
                                    <tr>
                                        <td className="py-2 pr-4 text-muted-foreground">ID Member</td>
                                        <td className="py-2">{membership?.order_id || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 text-muted-foreground">Tanggal Bergabung</td>
                                        <td>
                                            {membership
                                                ? new Intl.DateTimeFormat("id-ID", {
                                                    year: "2-digit",
                                                    month: "short",
                                                    day: "2-digit",
                                                }).format(new Date(membership.join_date))
                                                : "18/26"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 text-muted-foreground">Tanggal Expired</td>
                                        <td>
                                            {membership
                                                ? new Intl.DateTimeFormat("id-ID", {
                                                    year: "2-digit",
                                                    month: "short",
                                                    day: "2-digit",
                                                }).format(new Date(membership.exp_date))
                                                : "18/26"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end w-full sm:w-1/2">
                            {/* Kartu desain membership */}
                            <Card className="w-full shadow-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 sm:w-2/3">
                                <CardHeader className="flex flex-col justify-between h-36">
                                    <Image
                                        alt="Membership"
                                        src="/images/logo_transparent.png"
                                        width={60}
                                        height={60}
                                    />
                                    <CardDescription className="text-white">
                                        {membership?.order_id ? (
                                            <p>{membership.order_id}</p>
                                        ) : (
                                            <p>MEM-XXXXX</p>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex items-center justify-between px-4 py-2 text-white rounded-b-lg bg-slate-700">
                                    <p>{user?.name || "User"}</p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Exp:</span>{" "}
                                        {membership
                                            ? new Intl.DateTimeFormat("id-ID", {
                                                month: "2-digit",
                                                year: "2-digit",
                                            }).format(new Date(membership.exp_date))
                                            : "18/26"}
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </CardContent>
                )}
            </Card>
        </MemberLayout>
    );
}
