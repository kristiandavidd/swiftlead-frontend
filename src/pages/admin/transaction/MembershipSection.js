"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const MembershipSection = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await axios.get(`${apiUrl}/transactions`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-6 py-2 text-xs text-gray-500">Order ID</th>
                        <th className="px-6 py-2 text-xs text-gray-500">Status</th>
                        <th className="px-6 py-2 text-xs text-gray-500">Amount</th>
                        <th className="px-6 py-2 text-xs text-gray-500">Payment Type</th>
                        <th className="px-6 py-2 text-xs text-gray-500">Transaction Time</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="px-6 py-4 text-sm">{transaction.order_id}</td>
                            <td className="px-6 py-4 text-sm">{transaction.status}</td>
                            <td className="px-6 py-4 text-sm">{transaction.amount}</td>
                            <td className="px-6 py-4 text-sm">{transaction.payment_type}</td>
                            <td className="px-6 py-4 text-sm">
                                {new Date(transaction.transaction_time).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MembershipSection;
