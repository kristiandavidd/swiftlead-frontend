"use client";

import UserLayout from "@/layout/UserLayout";
import { useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ControlSection from "./ControlSection";
import ManagementSection from "./ManagementSection";
import TrackingSection from "./TrackingSection";

export default function Control() {
    const [activeTab, setActiveTab] = useState("monitoring");

    return (
        <UserLayout className="mx-auto" head={"Article Page"}>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Monitor Your Devices and Nests</h1>
                <p className="text-sm">Manage device, installation and maintenance for user.</p>
            </div>
            <div className="p-4 overflow-x-auto bg-white rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                    <TabsList className="grid w-1/2 grid-cols-3 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="monitoring">Monitoring</TabsTrigger>
                        <TabsTrigger className="py-2" value="management">Nest Management</TabsTrigger>
                        <TabsTrigger className="py-2" value="tracking">History & Tracking</TabsTrigger>
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
