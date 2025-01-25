"use client";

import AdminLayout from "@/layout/AdminLayout";
import { useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstallationSection from "./InstallationSection";
import MaintenanceSection from "./MaintenanceSection";
import DeviceSection from "./DeviceSection";
import UninstallationSection from "./UninstallationSection";

export default function Installation() {
    const [activeTab, setActiveTab] = useState("devices");

    return (
        <AdminLayout className="mx-auto" head={"Kelola Perangkat"}>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Kelola Instalasi, Pemeliharaan, dan Uninstalasi Perangkat</h1>
                <p className="text-sm">Mengelola pengajuan instalasi, pemeliharaan, dan uninstalasi perangkat untuk user.</p>
            </div>
            <div className="p-4 overflow-x-auto bg-white rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                    <TabsList className="grid w-3/4 grid-cols-4 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="devices">Kelola Perangkat</TabsTrigger>
                        <TabsTrigger className="py-2" value="installation">Pengajuan instalasi</TabsTrigger>
                        <TabsTrigger className="py-2" value="maintenance">Pengajuan Pemeliharaan</TabsTrigger>
                        <TabsTrigger className="py-2" value="uninstallation">Pengajuan Uninstalasi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="devices">
                        <DeviceSection ></DeviceSection>
                    </TabsContent>
                    <TabsContent value="installation">
                        <InstallationSection setActiveTab={setActiveTab} ></InstallationSection>
                    </TabsContent>
                    <TabsContent value="maintenance">
                        <MaintenanceSection></MaintenanceSection>
                    </TabsContent>
                    <TabsContent value="uninstallation">
                        <UninstallationSection></UninstallationSection>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout >
    );
}
