import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "./ui/badge";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const ArticleForm = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cover, setCover] = useState(null);
    const [tags, setTags] = useState([]); // List of tags
    const [selectedTag, setSelectedTag] = useState(""); // Selected tag ID
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();
    const { id } = router.query;

    const apiUrl =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchTags(); // Fetch tags when component mounts
        if (id) {
            fetchArticle(); // Fetch article data if editing
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchTags = async () => {
        try {
            const res = await axios.get(`${apiUrl}/articles/tags`);
            setTags(res.data[0]);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/articles/${id}`);
            if (res.data.length > 0) {
                const { title, content, cover_image, tags_id } = res.data[0];
                setTitle(title || ""); // Set title
                setContent(content || ""); // Set content
                setCover(cover_image || null); // Set cover image
                setSelectedTag(tags_id || ""); // Set selected tag ID
            }
        } catch (error) {
            console.error("Error fetching article:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log("selectedtag", selectedTag)

    const handleSubmit = async (e, status = 1) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("tags_id", selectedTag); // Add tag ID
        formData.append("status", status);

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
            router.push("/admin/article");
        } catch (error) {
            console.error("Error submitting article:", error);
        }
    };

    return (
        <div className="max-w-3xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md">
            <h1 className="mb-4 text-2xl font-bold">{id ? "Edit Article" : "Create Article"}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={(e) => handleSubmit(e)}>
                    {/* Cover Image */}
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

                    {/* Title */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Content</label>
                        <ReactQuill value={content} onChange={setContent} theme="snow" />
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Tag</label>
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Tag</option>
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-2 font-medium text-white rounded-md bg-primary hover:bg-primary/90"
                        >
                            {id ? "Update Article" : "Create Article"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ArticleForm;
