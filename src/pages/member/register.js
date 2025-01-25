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
                <h1 className="mb-4 text-2xl font-bold">Pendaftaran Membership</h1>
                <p>
                    Bergabung dengan Komunitas Peternak Walet Kelas Atas!
                </p>
                <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                    Daftar Membership
                </Button>
                <RegistMembershipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </UserLayout>
    );
}
