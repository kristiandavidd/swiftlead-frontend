import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconPencil, IconTrash, IconPlus, IconSearch, IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";


export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [filteredUser, setFilteredUser] = useState([]); // Artikel yang sudah difilter
    const [searchQuery, setSearchQuery] = useState(""); // State untuk input pencarian
    const [sortColumn, setSortColumn] = useState(""); // Kolom yang sedang di-sort
    const [sortDirection, setSortDirection] = useState("asc"); // Arah sort: asc / desc
    const { toast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        handleSearch(); // Memperbarui data pencarian setiap kali query berubah
    },);


    const fetchUsers = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/user`);
            setUsers(res.data);
            setFilteredUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/user/${id}/role`, { role: newRole });
            toast({ title: "Success", description: "Role updated successfully", variant: "success" });
            fetchUsers();
        } catch (err) {
            console.error("Error updating role:", err);
            toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/user/${id}/membership`, { status: newStatus });
            toast({ title: "Success", description: "Membership updated successfully", variant: "success" });
            fetchUsers();
        } catch (err) {
            console.error("Error updating membership:", err);
            if (err.response.status === 400) {
                toast({ title: "Error", description: "Cannot change user status. User password is not set.", variant: "destructive" });
            } else {
                toast({ title: "Error", description: "Failed to update membership", variant: "destructive" });
            }
        }
    };

    const handleDeleteUser = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.delete(`${apiUrl}/user/${selectedUserId}`);
            toast({ title: "Success", description: "User deleted successfully", variant: "success" });
            fetchUsers();
            setSelectedUserId(null);
        } catch (err) {
            console.error("Error deleting user:", err);
            toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            setFilteredUser(users); // Jika pencarian kosong, tampilkan semua pengguna
        } else {
            const query = searchQuery.toLowerCase();

            const filtered = users.filter((user) => {
                const name = user.name?.toLowerCase() || "";
                const email = user.email?.toLowerCase() || "";
                const noTelp = user.no_telp?.toLowerCase() || "";

                return (
                    name.includes(query) ||
                    email.includes(query) ||
                    noTelp.includes(query)
                );
            });

            setFilteredUser(filtered);
        }
    };

    return (
        <div>
            <div className="flex justify-between px-2 py-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        size="sm"
                        placeholder="Search user"
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);

                        }}
                    />
                    <Button><IconSearch className="w-8 h-8 " strokeWidth={2.4} /></Button>
                </div>
                <Link href="/admin/user/create">
                    <Button size="sm" >
                        <IconPlus className="mr-2" /> Add User
                    </Button>
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan="6" className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : (
                        filteredUser.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.no_telp}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role.toString()}
                                        onValueChange={(value) => handleRoleChange(user.id, parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="0">User</SelectItem>
                                                <SelectItem value="1">Admin</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={user.status.toString()}
                                        onValueChange={(value) => handleStatusChange(user.id, parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Membership" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="-1">Inactive</SelectItem>
                                                <SelectItem value="0">Active</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/user/edit/${user.id}`}>
                                            <Button variant="outline">
                                                <IconPencil />
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" onClick={() => setSelectedUserId(user.id)}>
                                                    <IconTrash />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeleteUser}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}