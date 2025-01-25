"use client";

import UserLayout from "@/layout/UserLayout";
import { useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ControlSection from "./ControlSection";
import ManagementSection from "./ManagementSection";
import TrackingSection from "./TrackingSection";
import { useUser } from "@/context/userContext";

export default function Control() {
    const [activeTab, setActiveTab] = useState("monitoring");
    const { user } = useUser();

    console.log("user from control", user)

    return (
        <UserLayout className="mx-auto" head={"Perangkat & Kandang"}>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Pantau Kandang dan Perangkatmu</h1>
                <p className="text-sm">Kelola perangkat dan ajukan instalasi, pemeliharaan, serta uninstalasi.</p>
            </div>
            <div className="p-4 overflow-x-auto bg-white rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                    <TabsList className="grid w-1/2 grid-cols-3 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="monitoring">Pemantauan</TabsTrigger>
                        <TabsTrigger className="py-2" value="management">Kelola Kandang</TabsTrigger>
                        <TabsTrigger className="py-2" value="tracking">Riwayat Pengajuan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="monitoring">
                        <ControlSection setActiveTab={setActiveTab} ></ControlSection>
                    </TabsContent>
                    <TabsContent value="management" setActiveTab={setActiveTab}>
                        <ManagementSection ></ManagementSection>
                    </TabsContent>
                    <TabsContent value="tracking">
                        <TrackingSection></TrackingSection>
                    </TabsContent>
                </Tabs>
            </div>
        </UserLayout >
    );
}
