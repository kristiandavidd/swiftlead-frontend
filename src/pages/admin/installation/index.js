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
        <AdminLayout className="mx-auto" head={"Article Page"}>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Manage Devices, Installation, and Maintenance</h1>
                <p className="text-sm">Manage device, installation and maintenance for user.</p>
            </div>
            <div className="p-4 overflow-x-auto bg-white rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                    <TabsList className="grid w-3/4 grid-cols-4 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="devices">Manage Devices</TabsTrigger>
                        <TabsTrigger className="py-2" value="installation">Installation Request</TabsTrigger>
                        <TabsTrigger className="py-2" value="maintenance">Maintenance Request</TabsTrigger>
                        <TabsTrigger className="py-2" value="uninstallation">Uninstallation Request</TabsTrigger>
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
