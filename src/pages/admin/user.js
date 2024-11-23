import AdminLayout from "@/layout/AdminLayout"
import axios from "axios"
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function User() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        axios.get(`${apiUrl}/user`)
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("there was an arror", err);
            });
    }, []);

    return (
        <AdminLayout>
            <div className="flex flex-col w-full">
                <p className="text-lg font-semibold">Admin Dashboard</p>
                <p className="hidden text-sm md:block">Bagian User</p>
            </div>
            <Table>
                <TableCaption>A list of active users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.user}>
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>{user.created_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </AdminLayout>
    )
}