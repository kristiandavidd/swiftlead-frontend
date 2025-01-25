"use client";

import UserLayout from "@/layout/UserLayout";
import MemberLayout from "@/layout/MemberLayout";

export default function SuccessPage() {
    return (
        <MemberLayout head="Payment Successful">
            <div className="container p-4 mx-auto text-center">
                <h1 className="text-2xl font-bold">Pembayaran Berhasil!</h1>
                <p>Selamat Datang Peternak Walet Premium.</p>
            </div>
        </MemberLayout>
    );
}
