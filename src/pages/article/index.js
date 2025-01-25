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
import { IconExternalLink, IconPencil, IconSearch, IconTrash } from "@tabler/icons-react";
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
import GuestLayout from "@/layout/GuestLayout";

export default function Article() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]); // Artikel yang sudah difilter
    const [searchQuery, setSearchQuery] = useState(""); // State untuk input pencarian
    const [selectedArticleId, setSelectedArticleId] = useState(null); // Untuk ID artikel yang akan dihapus
    const { toast } = useToast();
    const apiUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchArticles();
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
        const apiUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await axios.get(`${apiUrl}/articles/published`);
            setArticles(res.data[0]);
            setFilteredArticles(res.data[0]);
        } catch (error) {
            console.error("Error fetching articles:", error);
            toast({
                title: "Galat!",
                description: "Gagal mengambil data artikel.",
                variant: "destructive"
            });
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

    return (
        <GuestLayout className="mx-auto" head={"Article"}>
            <div className="flex justify-between mb-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search article"
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        onChange={handleSearch}
                    />
                    <Button><IconSearch className="w-8 h-8 " strokeWidth={2.4} /></Button>
                </div>
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
                                        className="w-full h-[200px] rounded-lg object-cover"
                                        width={80}
                                        height={80}
                                    />
                                )}
                                <CardTitle className="duration-300 ease-in-out text-md hover:text-muted-foreground">{article.title}</CardTitle>
                                <CardDescription>{truncateText(stripHtmlTags(article.content), 100)}</CardDescription>
                            </Link>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                            <Link href={`/article/${article.id}`} className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none h-9 px-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-primary bg-background hover:bg-accent hover:text-accent-foreground w-full'>
                                Baca Artikel
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </GuestLayout>
    );
}
