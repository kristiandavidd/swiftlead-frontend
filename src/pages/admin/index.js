"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp, IconUsers, IconWallet, IconArticle, IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRequests: 0,
        totalWeeklyPrices: 0,
    });

    const statusMapping = {
        0: 'Menunggu',
        1: 'Pengecekan',
        2: 'Disetujui',
        3: 'Selesai',
        4: 'Dibatalkan',
        5: 'Ditolak',
        6: "Dijadwalkan Ulang"
    };

    const [harvestSales, setHarvestSales] = useState([]);
    const [requests, setRequests] = useState([]);
    const [weeklyPrices, setWeeklyPrices] = useState([]);

    const apiUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch Harvest Sales
            const salesRes = await axios.get(`${apiUrl}/sales`);
            const allSales = salesRes.data;
            setHarvestSales(allSales.slice(0, 2)); // Ambil 2 terbaru
            setStats(prev => ({ ...prev, totalSales: allSales.length }));

            // Fetch Requests (Gabungkan 3 API)
            const [installationRes, maintenanceRes, uninstallationRes] = await Promise.all([
                axios.get(`${apiUrl}/request/installation`),
                axios.get(`${apiUrl}/request/maintenance`),
                axios.get(`${apiUrl}/request/uninstallation`)
            ]);
            const allRequests = [
                ...installationRes.data,
                ...maintenanceRes.data,
                ...uninstallationRes.data
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Urutkan terbaru
            setRequests(allRequests.slice(0, 2)); // Ambil 2 terbaru
            setStats(prev => ({ ...prev, totalRequests: allRequests.length }));

            // Fetch Weekly Prices
            const weeklyPricesRes = await axios.get(`${apiUrl}/weekly-price/all`);
            const allPrices = weeklyPricesRes.data;
            setWeeklyPrices(allPrices.slice(0, 2)); // Ambil 2 terbaru
            setStats(prev => ({ ...prev, totalWeeklyPrices: allPrices.length }));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="grid gap-6 md:grid-cols-3">
                {/* Ringkasan Statistik */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <IconShoppingBag className="w-6 h-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.totalSales}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <IconUsers className="w-6 h-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.totalRequests}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">Weekly Prices</CardTitle>
                        <IconTrendingUp className="w-6 h-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.totalWeeklyPrices}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Harvest Sales Terbaru */}
            <div className="p-6 mt-6 bg-white rounded-lg">
                <h2 className="mb-2 text-lg font-semibold">Latest Harvest Sales</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {harvestSales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{new Date(sale.created_at).toLocaleDateString("id-ID")}</TableCell>
                                <TableCell>{sale.bowl_weight * sale.oval_weight + sale.corner_weight + sale.broken_weight} kg</TableCell>
                                <TableCell>Rp {parseInt(sale.price * (sale.bowl_weight * sale.oval_weight + sale.corner_weight + sale.broken_weight)).toLocaleString("id-ID")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Request Terbaru */}
            <div className="p-6 mt-6 bg-white rounded-lg">
                <h2 className="mb-2 text-lg font-semibold">Latest Requests</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>House</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell>Pemeliharaan</TableCell>
                                <TableCell>{req.house_name}</TableCell>
                                <TableCell>
                                    <Badge >
                                        {statusMapping[req.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(req.created_at).toLocaleDateString("id-ID")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Weekly Birdnest Prices */}
            <div className="p-6 mt-6 bg-white rounded-lg">
                <h2 className="mb-2 text-lg font-semibold">Latest Weekly Birdnest Prices</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Province</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Start Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {weeklyPrices.map((price) => (
                            <TableRow key={price.id}>
                                <TableCell>{price.province}</TableCell>
                                <TableCell>Rp {parseInt(price.price).toLocaleString("id-ID")}</TableCell>
                                <TableCell>{new Date(price.week_start).toLocaleDateString("id-ID")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
