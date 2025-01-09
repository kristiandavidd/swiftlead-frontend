"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "@/layout/UserLayout";
import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HarvestPage() {
    const [groupedHarvests, setGroupedHarvests] = useState({});
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) fetchHarvests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchHarvests = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/harvest/${user.id}`);
            const grouped = groupByDate(res.data);
            setGroupedHarvests(grouped);
        } catch (error) {
            console.error("Error fetching harvests:", error);
        }
    };

    const groupByDate = (harvests) => {
        return harvests.reduce((acc, harvest) => {
            const date = new Date(harvest.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(harvest);
            return acc;
        }, {});
    };

    return (
        <UserLayout>
            <h1 className="mb-4 text-2xl font-bold">Harvest Monitoring</h1>
            <div className="p-4 bg-white rounded-lg ">
                <div className="flex gap-4">
                    <Link href="/harvest/add-harvest" className="my-4">
                        <Button>Add Harvest</Button>
                    </Link>
                    <Link href="/sales/sell-harvest" className="my-4">
                        <Button>Sell Your Harvest</Button>
                    </Link>
                </div>
                {Object.entries(groupedHarvests).map(([date, harvests]) => (
                    <div key={date} className="p-4 my-4 border rounded-lg">
                        <h2 className="mb-4 text-xl font-semibold">{date} Harvest</h2>
                        <div className="grid grid-cols-3 gap-4">

                            {harvests.map((harvest) => (
                                <div key={harvest.id} className="w-full p-2 mb-2 border rounded-md">
                                    <h3 className="mb-2 font-semibold">Floor {harvest.floor}</h3>
                                    <p>Bowl: {harvest.bowl} kg (Ideal: {harvest.ideal_bowl} kg)</p>
                                    <p>Oval: {harvest.oval} kg (Ideal: {harvest.ideal_oval} kg)</p>
                                    <p>Corner: {harvest.corner} kg (Ideal: {harvest.ideal_corner} kg)</p>
                                    <p>Broken: {harvest.broken} kg (Ideal: {harvest.ideal_broken} kg)</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </UserLayout>
    );
}
