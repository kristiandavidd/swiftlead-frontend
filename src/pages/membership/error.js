"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
    const router = useRouter();

    useEffect(() => {
        console.log("Payment Error");

        // Redirect ke /membership setelah 3 detik
        const timeout = setTimeout(() => {
            router.push('/membership/register');
        }, 3000);

        // Membersihkan timeout ketika komponen di-unmount
        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-3xl font-bold">❌ Payment Failed!</h1>
            <p>There was an issue with your payment. Please try again.</p>
            <Button className="mt-4" onClick={() => router.push('/membership/register')}>
                Retry Payment
            </Button>
        </div>
    );
}
