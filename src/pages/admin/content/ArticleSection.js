"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddEditArticleModal from "@/components/AddEditArticleModal";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import AdminLayout from "@/layout/AdminLayout";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IconPlus, IconPencil, IconSearch, IconTrash } from "@tabler/icons-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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

export default function ArticleTable() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [selectedArticleId, setSelectedArticleId] = useState(null); 
    const { toast } = useToast();
    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchArticles();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stripHtmlTags = (html) => {
        return html.replace(/<[^>]*>/g, ''); 
    };

    const truncateText = (text, maxLength) => {
        if (!text || text.length === 0) {
            return '';  
        }

        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const fetchArticles = async () => {
        try {
            const res = await axios.get(`${apiUrl}/articles`);
            setArticles(res.data[0]);
            setFilteredArticles(res.data[0]);
        } catch (error) {
            console.error("Error fetching articles:", error);
            toast({
                title: "Galat!",
                description: error.response?.data?.message || "Gagal mengambil data artikel.",
                variant: "destructive",
            });
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredArticles(articles); 
        } else {
            const filtered = articles.filter((article) => {
                return (
                    article.title.toLowerCase().includes(query) ||
                    stripHtmlTags(article.content).toLowerCase().includes(query)
                );
            });
            setFilteredArticles(filtered);
        }
    };

    const handleDelete = async () => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.delete(`${apiUrl}/articles/${selectedArticleId}`);
            toast({
                title: "Sukses!",
                description: "Artikel berhasil dihapus.",
                variant: "success",
            });
            fetchArticles();
            setSelectedArticleId(null);
        } catch (error) {
            console.error("Error deleting article:", error);
            toast({
                title: "Galat!",
                description: error.response?.data?.message || "Gagal menghapus artikel.",
                variant: "destructive",
            });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            await axios.put(`${apiUrl}/articles/${id}/status`, { status: newStatus });
            toast({
                title: "Sukses!",
                description: "Status berhasil diperbarui.",
                variant: "success",
            });
            fetchArticles();
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Galat!",
                description: error.response?.data?.message || "Gagal memperbarui status.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="mx-auto">
            <div className="flex justify-between mb-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        size="sm"
                        placeholder="Cari artikel.."
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        onChange={handleSearch}
                    />
                    <Button size="sm"><IconSearch className="w-8 h-8 " strokeWidth={2.4} /></Button>
                </div>
                <Link className="" href={"/admin/content/create"}>
                    <Button size="sm">
                        <IconPlus className="mr-2" /> Buat
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                    <Card key={article.id} className="flex flex-col justify-between hover:opacity-80">
                        <CardHeader className="pb-2">
                            <Link href={`/article/${article.id}`} target="_blank" className="flex flex-col gap-2">
                                {article.cover_image && (
                                    <Image
                                        src={`${apiUrl}${article.cover_image}`}
                                        alt="Cover"
                                        className="w-full h-[150px] rounded-lg object-cover"
                                        width={80}
                                        height={80}
                                    />
                                )}
                                {article.tag_name && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-md">{article.tag_name}</span>
                                    </div>
                                )}
                                <CardTitle className="duration-300 ease-in-out text-md hover:text-muted-foreground">{article.title}</CardTitle>
                                <CardDescription>{truncateText(stripHtmlTags(article.content), 50)}</CardDescription>
                            </Link>
                        </CardHeader>
                        <CardFooter className="flex flex-col">
                            <div className="flex items-center justify-between w-full gap-2">
                                <Select
                                    value={article.status === 1 ? "published" : article.status === 2 ? "membership" : "draft"}
                                    onValueChange={(value) => handleStatusChange(article.id, value === "published" ? 1 : value === "membership" ? 2 : 0)}
                                >
                                    <SelectTrigger className="w-3/5">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="published">Publik</SelectItem>
                                            <SelectItem value="membership">Membership</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button size="sm" className="w-1/5">
                                    <Link href={`/admin/content/edit/${article.id}`}>
                                        {console.log("article id: ", article.id)}
                                        <IconPencil />
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="w-1/5" onClick={() => setSelectedArticleId(article.id)}>
                                            <IconTrash />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                                            <AlertDialogDescription>Aksi ini tidak bisa dikembalikan.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Batal
                                            </AlertDialogCancel>
                                            <AlertDialogAction className="bg-destructive hover:bg-destructive/80" onClick={handleDelete}>
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
