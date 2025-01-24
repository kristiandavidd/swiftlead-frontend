"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        console.log("Payment Success");

        // Redirect ke /membership setelah 3 detik
        const timeout = setTimeout(() => {
            router.push('/member');
        }, 3000);

        // Membersihkan timeout ketika komponen di-unmount
        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-3xl font-bold">🎉 Payment Successful!</h1>
            <p>Thank you for subscribing to our membership.</p>
            <p className="mt-2 text-sm text-gray-500">Redirecting to your dashboard in 3 seconds...</p>
            <Button className="mt-4" onClick={() => router.push('/member')}>
                Go to Dashboard Now
            </Button>
        </div>
    );
}
