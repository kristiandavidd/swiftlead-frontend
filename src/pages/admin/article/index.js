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
    const [filteredArticles, setFilteredArticles] = useState([]); // Artikel yang sudah difilter
    const [searchQuery, setSearchQuery] = useState(""); // State untuk input pencarian
    const [selectedArticleId, setSelectedArticleId] = useState(null); // Untuk ID artikel yang akan dihapus
    const { toast } = useToast();
    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchArticles();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stripHtmlTags = (html) => {
        return html.replace(/<[^>]*>/g, ''); // Menghapus semua tag HTML
    };

    const truncateText = (text, maxLength) => {
        if (!text || text.length === 0) {
            return '';  // Jika text kosong atau undefined, kembalikan string kosong
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
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredArticles(articles); // Jika pencarian kosong, tampilkan semua artikel
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
                title: "Success",
                description: "Article deleted successfully!",
                variant: "success",
            });
            fetchArticles();
            setSelectedArticleId(null);
        } catch (error) {
            console.error("Error deleting article:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete article",
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
                title: "Success",
                description: "Status updated successfully!",
                variant: "success",
            });
            fetchArticles();
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update status",
                variant: "destructive",
            });
        }
    };

    return (
        <AdminLayout className="mx-auto" head={"Article Page"}>
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold">Manage Articles</h1>
                <p className="text-sm">Manage Article page</p>
            </div>
            <div className="flex justify-between mb-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        size="sm"
                        placeholder="Search article"
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        onChange={handleSearch}
                    />
                    <Button size="sm"><IconSearch className="w-8 h-8 " strokeWidth={2.4} /></Button>
                </div>
                <Link className="" href={"/admin/article/create"}>
                    <Button size="sm">
                        <IconPlus className="mr-2" />Create
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
                                <CardTitle className="duration-300 ease-in-out text-md hover:text-muted-foreground">{article.title}</CardTitle>
                                <CardDescription>{truncateText(stripHtmlTags(article.content), 50)}</CardDescription>
                            </Link>
                        </CardHeader>
                        <CardFooter className="flex flex-col">
                            <div className="flex justify-between w-full gap-2">
                                <Select
                                    value={article.status === 1 ? "published" : "draft"}
                                    onValueChange={(value) => handleStatusChange(article.id, value === "published" ? 1 : 0)}
                                >
                                    <SelectTrigger className="w-3/5">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Link href={`/admin/article/edit/${article.id}`} className="inline-flex items-center justify-center w-1/5 gap-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                                    <IconPencil />
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-1/5" onClick={() => setSelectedArticleId(article.id)}>
                                            <IconTrash />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AdminLayout>
    );
}
