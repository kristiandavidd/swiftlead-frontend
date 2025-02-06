"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
    const router = useRouter();

    useEffect(() => {
        console.log("Payment Error");

        const timeout = setTimeout(() => {
            router.push('/membership/register');
        }, 2000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-3xl font-bold">❌ Pembayaran Gagal!</h1>
            <p>Terdapat kesalahan dalam pembayaran. Silakan coba lagi .</p>
            <Button className="mt-4" onClick={() => router.push('/membership/register')}>
                Coba Lagi
            </Button>
        </div>
    );
}
