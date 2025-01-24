import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { toast } from "@/hooks/use-toast";
import Spinner from "./ui/spinner";

export default function ArticleForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cover, setCover] = useState(null);
    const [tags, setTags] = useState([]); // List of tags
    const [selectedTag, setSelectedTag] = useState(""); // Selected tag ID
    const [status, setStatus] = useState("0"); // Default status as draft
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();
    const { id } = router.query;

    const apiUrl =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchTags();
        if (id) {
            fetchArticle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchTags = async () => {
        try {
            const res = await axios.get(`${apiUrl}/articles/tags`);
            setTags(res.data[0]);
        } catch (error) {
            console.error("Error fetching tags:", error);
            toast({ title: "Galat!", description: "Gagal mendapatkan kata kunci.", variant: "error" });
        }
    };

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/articles/${id}`);
            if (res.data.length > 0) {
                const { title, content, cover_image, tags_id, status } = res.data[0];
                setTitle(title || "");
                setContent(content || "");
                setCover(cover_image || null);
                setSelectedTag(tags_id || "");
                setStatus(status !== undefined ? status.toString() : "0");
            }
        } catch (error) {
            console.error("Error fetching article:", error);
            toast({ title: "Galat!", description: "Gagal mendapatkan artikel.", variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e,) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("tags_id", selectedTag);
        formData.append("status", status);

        console.log("data:", title, selectedTag, status, cover);

        if (cover instanceof File) {
            formData.append("cover", cover);
        } else if (typeof cover === "string") {
            formData.append("cover_image", cover);
        }

        try {
            if (id) {
                await axios.put(`${apiUrl}/articles/${id}`, formData);
            } else {
                await axios.post(`${apiUrl}/articles`, formData);
            }
            toast({ title: "Sukses!", description: "Artikel berhasil disimpan.", variant: "success" });
            router.push("/admin/content");
        } catch (error) {
            console.error("Error submitting article:", error);
            toast({ title: "Galat!", description: "Gagal menyimpan artikel.", variant: "error" });
        }
    };

    return (
        <div className="max-w-3xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md">
            <h1 className="mb-4 text-2xl font-bold">{id ? "Mengubah Artikel" : "Menulis Artikel"}</h1>
            {loading ? (
                <div className="flex items-center justify-center h-32">
                    <Spinner />
                </div>
            ) : (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="flex flex-col items-center gap-2 mb-4">
                        {cover && (
                            <Image
                                src={cover instanceof File ? URL.createObjectURL(cover) : `${apiUrl}${cover}`}
                                alt="Cover"
                                className="w-1/2 m-auto mt-4 rounded-lg"
                                width={80}
                                height={80}
                            />
                        )}
                        <Input
                            type="file"
                            onChange={(e) => setCover(e.target.files[0])}
                            className="block w-1/2 m-auto text-sm text-center text-gray-900 border rounded-md bg-gray-50"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Judul artikel</label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul artikel yang menarik.."
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Konten artikel</label>
                        <ReactQuill value={content} onChange={setContent} theme="snow" />
                    </div>

                    <div className="flex justify-between gap-4 mb-4">
                        <div className="w-1/2">
                            <label className="block mb-2 font-medium text-gray-700">Status</label>
                            <Select
                                value={status}
                                onValueChange={(value) => setStatus(value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih status publikasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status Publikasi</SelectLabel>
                                        <SelectItem value="1">Publik</SelectItem>
                                        <SelectItem value="2">Membership</SelectItem>
                                        <SelectItem value="0">Draft</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-1/2">
                            <label className="block mb-2 font-medium text-gray-700">Pilih kata kunci</label>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih kata kunci</option>
                                {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/content")}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="px-6 py-2 font-medium text-white rounded-md bg-primary hover:bg-primary/90"
                        >
                            {id ? "Perbarui Artikel" : "Buat Artikel"}
                        </Button>
                    </div>
                </form>
            )
            }
        </div >
    );
};
