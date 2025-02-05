"use client";

import { useEffect, useState } from "react";
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
import MembershipModal from "@/components/membershipModal";
import { useToast } from "@/hooks/use-toast";
import { IconSearch, IconPencil, IconTrash } from "@tabler/icons-react";
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
import Link from "next/link";
import EditMembershipModal from "@/components/editMembershipModal";
import Spinner from "@/components/ui/spinner";

export default function MembershipTable() {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMembershipId, setSelectedMembershipId] = useState(null);
    const [filteredMember, setFilteredMember] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchMemberships();
    }, []);

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberships, searchQuery]);

    const fetchMemberships = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/membership`);
            setMemberships(res.data);
        } catch (error) {
            console.error("Error fetching memberships:", error);
            toast({ title: "Galat!", description: "Gagal mengambil data membership.", variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMember = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.delete(`${apiUrl}/membership/${selectedMemberId}`);
            toast({ title: "Sukses!", description: "Berhasil menghapus member.", variant: "success" });
            fetchMemberships();
            setSelectedMemberId(null);
        } catch (err) {
            console.error("Error deleting member:", err);
            toast({ title: "Galat!", description: "Gagal menghapus member.", variant: "destructive" });
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        fetchMemberships();
    };

    const handleOpenEditModal = (id) => {
        setSelectedMembershipId(id);
        setIsEditModalOpen(true);
    };

    const handleMembershipUpdated = () => {
        fetchMemberships(); // Ambil data terbaru setelah edit
        setIsEditModalOpen(false); // Tutup modal
    };

    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            setFilteredMember(memberships); // Jika pencarian kosong, tampilkan semua pengguna
        } else {
            const query = searchQuery.toLowerCase();

            const filtered = memberships.filter((user) => {
                const name = user.name?.toLowerCase() || "";
                const email = user.email?.toLowerCase() || "";

                return (
                    name.includes(query) ||
                    email.includes(query)
                );
            });

            setFilteredMember(filtered);
        }
    };

    return (
        <div>
            <div className="flex justify-between px-2 py-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        size="sm"
                        placeholder="Cari member.."
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                    />
                    <Button size="sm"><IconSearch className="w-8 h-8 " strokeWidth={2.4} /></Button>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>Tambah Membership</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tanggal Berlangganan</TableHead>
                        <TableHead>Tanggal Kadaluarsa</TableHead>
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
                        filteredMember.map((membership) => (
                            <TableRow key={membership.id}>
                                <TableCell>{membership.name}</TableCell>
                                <TableCell>{membership.email}</TableCell>
                                <TableCell>{new Date(membership.join_date).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}</TableCell>
                                <TableCell>{
                                    new Date(membership.exp_date).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })
                                }</TableCell>
                                <TableCell>{membership.status == 1 ? "Aktif" : membership.status == 2 ? "Ditanggguhkan" : "Tidak aktif"}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={``}>
                                            <Button
                                                size="sm"
                                                className="bg-tersier-foreground/60 hover:bg-tersier-foreground/80"
                                                onClick={() => handleOpenEditModal(membership.id)}
                                            >
                                                <IconPencil />
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setSelectedMemberId(membership.id)}
                                                >
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
                                                    <AlertDialogAction onClick={handleDeleteMember} className="bg-destructive hover:bg-destructive/80">Hapus</AlertDialogAction>
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
            <MembershipModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
            <EditMembershipModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                membershipId={selectedMembershipId}
                onMembershipUpdated={handleMembershipUpdated}
            />
        </div>
    );
}
