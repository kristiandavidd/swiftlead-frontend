"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        console.log("Payment Success");

        const timeout = setTimeout(() => {
            router.push('/member');
        }, 2000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-3xl font-bold">🎉 Pembayaran Sukses!</h1>
            <p>Selamat Datang Peternak Walet Kelas Atas!</p>
            <p className="mt-2 text-sm text-gray-500">Kembali ke beranda dalam 3 detik...</p>
            <Button className="mt-4" onClick={() => router.push('/member')}>
                Langsung ke Beranda
            </Button>
        </div>
    );
}
