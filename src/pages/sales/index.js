"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UserLayout from "@/layout/UserLayout";
import Image from "next/image";
import ProgressStatus from "@/components/salesStatus";
import { useUser } from "@/context/userContext";

export default function SalesMonitoringPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            fetchSales();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchSales = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        if (!user?.id) {
            console.error("User ID not available");
            return;
        }

        try {
            const res = await axios.get(`${apiUrl}/sales/user/${user.id}`);
            setSales(res.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log(sales);

    return (
        <UserLayout >
            <h1 className="mb-4 text-2xl font-bold">Sales Monitoring</h1>
            <div className="p-4 bg-white rounded-lg ">
                <Link href="/sales/sell-harvest">
                    <Button>Add Sale</Button>
                </Link>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Province</TableHead>
                            <TableHead>Price (IDR)</TableHead>
                            <TableHead>Total Qty</TableHead>
                            <TableHead>Total Price (IDR)</TableHead>
                            <TableHead>Appointment Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.map((sale, index) => (
                            <TableRow key={sale.id || index}>
                                <TableCell>{sale?.province || 'Unknown Province'}</TableCell>
                                <TableCell>
                                    {sale?.price
                                        ? parseFloat(sale.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {sale?.bowl_weight + sale?.oval_weight + sale?.corner_weight + sale?.broken_weight} kg
                                </TableCell>
                                <TableCell>
                                    {(parseFloat(sale.price) *
                                        (parseFloat(sale.bowl_weight) +
                                            parseFloat(sale.oval_weight) +
                                            parseFloat(sale.corner_weight) +
                                            parseFloat(sale.broken_weight))
                                    ).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </TableCell>
                                <TableCell>
                                    {sale?.appointment_date
                                        ? new Date(sale.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <ProgressStatus status={sale.status} />
                                </TableCell>
                                <TableCell>
                                    <Link href={`/sales/detail/${sale.id}`}>
                                        <Button>View Details</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </UserLayout>
    );
}
