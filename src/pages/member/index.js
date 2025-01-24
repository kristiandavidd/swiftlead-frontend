"use client";

import UserLayout from "@/layout/UserLayout";
import MemberLayout from "@/layout/MemberLayout";

export default function SuccessPage() {
    return (
        <MemberLayout head="Payment Successful">
            <div className="container p-4 mx-auto text-center">
                <h1 className="text-2xl font-bold">Payment Successful!</h1>
                <p>Thank you for subscribing to our membership. You now have access to exclusive content.</p>
            </div>
        </MemberLayout>
    );
}
