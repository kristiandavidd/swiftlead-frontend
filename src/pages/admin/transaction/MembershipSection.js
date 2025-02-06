"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"; 
import { useToast } from "@/hooks/use-toast";

export default function MembershipSection() {
    const [transactions, setTransactions] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTransactions = async () => {
        const apiUrl =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await axios.get(`${apiUrl}/transactions`);
            setTransactions(response.data);
        } catch (error) {
            toast({ title: "Galat!", description: "Gagal mengambil data transaksi.", variant: "destructive" });
            console.error("Error fetching transactions:", error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-6 py-2 text-gray-500">
                            Order ID
                        </TableHead>
                        <TableHead className="px-6 py-2 text-gray-500">
                            Status
                        </TableHead>
                        <TableHead className="px-6 py-2 text-gray-500">
                            Total Pembayaran
                        </TableHead>
                        <TableHead className="px-6 py-2 text-gray-500">
                            Tipe Pembayaran
                        </TableHead>
                        <TableHead className="px-6 py-2 text-gray-500">
                            Waktu Transaksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="px-6 py-4 text-sm">
                                    {transaction.order_id}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm">
                                    {transaction.status}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm">
                                    {transaction.amount}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm">
                                    {transaction.payment_type}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm">
                                    {new Intl.DateTimeFormat("id-ID", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }).format(new Date(transaction.transaction_time))}
                                </TableCell>

                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="px-6 py-4 text-sm text-center"
                            >
                                No transactions available.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
