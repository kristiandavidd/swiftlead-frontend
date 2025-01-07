"use client";

import AdminLayout from "@/layout/AdminLayout";


import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import UserTable from "./UserTable";
import MembershipTable from "./MembershipTable";

export default function User() {


    return (
        <AdminLayout>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <p className="text-sm">Manage User page</p>
            </div>

            <div className="p-4 overflow-x-auto bg-white rounded-lg">
                <Tabs defaultValue="user" className="">
                    <TabsList className="grid w-1/2 grid-cols-2 p-0 px-2 pt-2 bg-white">
                        <TabsTrigger className="py-2" value="user">User</TabsTrigger>
                        <TabsTrigger className="py-2" value="membership">Membership</TabsTrigger>
                    </TabsList>
                    <TabsContent value="user">
                        <UserTable></UserTable>
                    </TabsContent>
                    <TabsContent value="membership">
                        <MembershipTable></MembershipTable>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
