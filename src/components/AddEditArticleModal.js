import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AddEditArticleModal({ onClose, onRefresh, article }) {
    const [title, setTitle] = useState(article?.title || "");
    const [content, setContent] = useState(article?.content || "");
    const [cover, setCover] = useState(null);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (cover) formData.append("cover", cover);

        try {
            const apiUrl = process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            if (article) {
                await axios.put(`${apiUrl}/articles/${article.id}`, formData);
            } else {
                await axios.post(`${apiUrl}/articles`, formData);
            }
            onRefresh();
            toast({ title: "Sukses!", description: "Artikel berhasil disimpan.", variant: "success" });
            onClose();
        } catch (error) {
            console.error("Error saving article:", error);
            toast({
                title: "Galat!",
                description: "Gagal menyimpan artikel.",
                variant: "error",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Title"
                placeholder="Judul artikel.."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Textarea
                label="Konten"
                placeholder="Tulis konten artikel disini.."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
            />
            <Input
                type="file"
                label="Gambar pratinjau.."
                onChange={(e) => setCover(e.target.files[0])}
            />
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose}>
                    Batal
                </Button>
                <Button type="submit" variant="primary">
                    Simpan
                </Button>
            </div>
        </form>
    );
};


