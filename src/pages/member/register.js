"use client";

import { useState } from "react";
import RegistMembershipModal from "@/components/registMembershipModal";
import { Button } from "@/components/ui/button";
import UserLayout from "@/layout/UserLayout";

export default function MembershipPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <UserLayout>
            <div className="container p-4 mx-auto">
                <h1 className="mb-4 text-2xl font-bold">Membership Registration</h1>
                <p>
                    Join our exclusive membership to enjoy premium benefits!
                </p>
                <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                    Register Membership
                </Button>
                <RegistMembershipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </UserLayout>
    );
}
