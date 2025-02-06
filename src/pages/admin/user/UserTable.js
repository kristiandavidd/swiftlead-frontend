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
import Spinner from "@/components/ui/spinner";


export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [filteredUser, setFilteredUser] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [sortColumn, setSortColumn] = useState(""); 
    const [sortDirection, setSortDirection] = useState("asc"); 
    const { toast } = useToast();

    useEffect(() => {
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleSearch(); 
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
            toast({ title: "Galat!", description: "Gagal mengambil data pengguna.", variant: "destructive" });
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/user/${id}/role`, { role: newRole });
            toast({ title: "Sukses!", description: "Berhasil memperbarui peran pengguna.", variant: "success" });
            fetchUsers();
        } catch (err) {
            console.error("Error updating role:", err);
            toast({ title: "Galat!", description: "Gagal memperbarui peran pengguna.", variant: "destructive" });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/user/${id}/membership`, { status: newStatus });
            toast({ title: "Sukses!", description: "Berhasil memperbarui status membership pengguna.", variant: "success" });
            fetchUsers();
        } catch (err) {
            console.error("Error updating membership:", err);
            if (err.response.status === 400) {
                toast({ title: "Galat!", description: "Pengguna belum menyiapkan password.", variant: "destructive" });
            } else {
                toast({ title: "Galat!", description: "Gagal memperbarui status pengguna.", variant: "destructive" });
            }
        }
    };

    const handleDeleteUser = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.delete(`${apiUrl}/user/${selectedUserId}`);
            toast({ title: "Sukses!", description: "Pengguna berhasil dihapus.", variant: "success" });
            fetchUsers();
            setSelectedUserId(null);
        } catch (err) {
            console.error("Error deleting user:", err);
            toast({ title: "Galat!", description: "Gagal menghapus pengguna.", variant: "destructive" });
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            setFilteredUser(users);
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
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        size="sm"
                        placeholder="Cari pengguna.."
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);

                        }}
                    />
                    <Button size="sm"><IconSearch className="w-8 h-8 " strokeWidth={2.4} /></Button>
                </div>
                <Link href="/admin/user/create">
                    <Button size="sm" >
                        <IconPlus className="mr-2" /> Tambah User
                    </Button>
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Nomor Telepon</TableHead>
                        <TableHead>Peran</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan="6" className="text-center">
                                <Spinner />
                            </TableCell>
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
                                            <SelectValue placeholder="Pilih peran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="0">Peternak Walet</SelectItem>
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
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="-1">Tidak Aktif</SelectItem>
                                                <SelectItem value="0">Aktif</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/user/edit/${user.id}`}>
                                            <Button size="sm" className="bg-tersier-foreground/60 hover:bg-tersier-foreground/80">
                                                <IconPencil />
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive" onClick={() => setSelectedUserId(user.id)}>
                                                    <IconTrash />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                                                    <AlertDialogDescription>Aksi ini tidak bisa dikembalikan.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/80">Hapus</AlertDialogAction>
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