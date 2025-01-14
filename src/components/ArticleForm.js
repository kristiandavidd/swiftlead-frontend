import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Badge } from './ui/badge';

const ArticleForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [cover, setCover] = useState(null); // Cover state yang baru
    const router = useRouter();
    const { id } = router.query; // ID artikel untuk edit
    const apiUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const apiUrl = process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_PROD_URL
            : process.env.NEXT_PUBLIC_API_URL;

        if (id) {
            axios.get(`${apiUrl}/articles/${id}`)
                .then(response => {
                    console.log('API Response:', response.data);
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        const { title, content, cover_image } = response.data[0]; // Ambil elemen pertama
                        setTitle(title || '');
                        setContent(content || '');
                        setCover(cover_image || null); // Set cover image jika ada
                    } else {
                        console.error('Invalid data format or empty response.');
                    }
                })
                .catch(error => console.error('Error fetching article:', error));
        }
    }, [id]);

    const handleSubmit = async (e, status = 1) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status); // Status: 1 (Published) atau 0 (Draft)

        // Jika cover baru dipilih, kirim file, jika tidak, kirim URL cover lama
        if (cover instanceof File) {
            formData.append('cover', cover);
        } else if (typeof cover === 'string') {
            formData.append('cover_image', cover); // Kirim cover image lama jika tidak ada file baru
        }

        try {
            const apiUrl = process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;
            if (id) {
                // Update artikel jika id ada
                await axios.put(`${apiUrl}/articles/${id}`, formData);
            } else {
                // Tambah artikel jika id tidak ada
                await axios.post(`${apiUrl}/articles`, formData);
            }
            router.push('/admin/article');
        } catch (error) {
            console.error('Error submitting article:', error);
        }
    };

    const handleSaveDraft = async () => {
        try {


            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('status', 0); // Status 0 untuk Draft

            if (cover instanceof File) {
                formData.append('cover', cover);
            } else if (typeof cover === 'string') {
                formData.append('cover_image', cover);
            }

            await axios.post(`${apiUrl}/articles`, formData);
            router.push('/admin/article');
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };

    return (
        <div className="max-w-3xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md">
            <h1 className="mb-4 text-2xl font-bold">{id ? 'Edit Article' : 'Create Article'}</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col items-center gap-2 mb-4">
                    {/* Menampilkan gambar cover sebelumnya jika tidak ada gambar yang dipilih */}
                    {cover && typeof cover === 'string' ? (
                        <Image src={`${apiUrl}${cover}`} alt="Cover" className="w-1/2 m-auto mt-4 rounded-lg" width={80} height={80} />
                    ) : cover && cover instanceof File ? (
                        <Image src={URL.createObjectURL(cover)} alt="Cover Preview" className="w-1/2 m-auto mt-4 rounded-lg" width={80} height={80} />
                    ) : null}
                    <div className='flex flex-col items-center my-3'>
                        <label className="block font-medium text-gray-700">Cover Image</label>
                        <p className='text-[12px] flex gap-2 items-center'>
                            <Badge className="bg-tersier-foreground/70 text-[12px]">Perhatian! </Badge>
                            Ukuran gambar maksimal 1MB dengan resolusi 800x400px
                        </p>
                    </div>
                    <Input
                        type="file"
                        onChange={(e) => setCover(e.target.files[0])}
                        className="block w-1/2 m-auto text-sm text-center text-gray-900 border rounded-md bg-gray-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Content</label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        className="bg-white"
                        theme="snow"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-2 font-medium text-white rounded-md bg-primary hover:bg-primary/90"
                    >
                        {id ? 'Update Article' : 'Create Article'}
                    </button>
                    {!id && (
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="px-6 py-2 font-medium text-white rounded-md bg-muted-foreground hover:bg-muted-foreground/90"
                        >
                            Save Draft
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;
