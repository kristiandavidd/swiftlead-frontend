import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import AddEditEbook from '@/components/AddEditEbookModal';
import { IconArrowUpRight, IconPencil, IconTrash } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';

const EbookSection = () => {
    const [ebooks, setEbooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [deletingEbookId, setDeletingEbookId] = useState(null);
    const [editingEbook, setEditingEbook] = useState(null);
    const { toast } = useToast();
    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    const fetchEbooks = async () => {
        try {
            const res = await axios.get(`${apiUrl}/ebook`);
            setEbooks(res.data);
        } catch (error) {
            console.error('Error fetching ebooks:', error);
            toast({ title: 'Galat!', description: 'Gagal mengambil data E-Book', variant: 'destructive' });
        }
    };

    const handleSubmit = async (formData) => {
        const form = new FormData();
        form.append('title', formData.title);
        if (formData.file) form.append('ebookFile', formData.file);
        if (formData.thumbnail) form.append('thumbnail', formData.thumbnail);

        try {
            if (editingEbook) {
                await axios.put(`${apiUrl}/ebook/${editingEbook.id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post(`${apiUrl}/ebook`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            fetchEbooks();
            setIsModalOpen(false);
            setEditingEbook(null);
            toast({ title: 'Sukses!', description: 'E-Book berhasil disimpan', variant: 'success' });
        } catch (error) {
            console.error('Error saving ebook:', error);
            toast({ title: 'Galat!', description: 'Gagal menyimpan E-Book', variant: 'destructive' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/ebook/${id}`);
            fetchEbooks();
            setIsAlertOpen(false);
            toast({ title: 'Sukses!', description: 'E-Book berhasil dihapus', variant: 'success' });
        } catch (error) {
            console.error('Error deleting ebook:', error);
            toast({ title: 'Galat!', description: 'Gagal menghapus E-Book', variant: 'destructive' });
        }
    };

    useEffect(() => {
        fetchEbooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container p-4 mx-auto">
            <Button onClick={() => setIsModalOpen(true)}>Unggah E-Book</Button>
            {/* Ebook Grid */}
            <div className="grid grid-cols-3 gap-4 mt-4">
                {ebooks.map((ebook) => (
                    <div key={ebook.id} className="p-4 border rounded">
                        <Image
                            src={`${apiUrl}${ebook.thumbnail_path}`}
                            alt={ebook.title}
                            className="object-cover mx-auto mt-4 mb-4 rounded-md max-h-96"
                            width={400}
                            height={800}
                        />
                        <h2 className="mb-6 text-lg font-bold">{ebook.title}</h2>
                        <div className='flex items-center justify-between w-full gap-2'>

                            <Button className="w-2/4" variant="outline">
                                <Link href={`${apiUrl}${ebook.file_path}`} target="_blank" className='inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none h-9 px-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground'>
                                    <IconArrowUpRight /> Pratinjau
                                </Link>
                            </Button>
                            <Button className="w-1/4"
                                onClick={() => {
                                    setEditingEbook({ ...ebook, apiUrl });
                                    setIsModalOpen(true);
                                }}
                            >
                                <IconPencil />
                            </Button>
                            <Button className="w-1/4" onClick={() => {
                                setDeletingEbookId(ebook.id);
                                setIsAlertOpen(true);
                            }} variant="destructive">
                                <IconTrash />
                            </Button>
                        </div>

                    </div>
                ))}
            </div>

            <AddEditEbook
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingEbook(null);
                }}
                onSubmit={handleSubmit}
                editingEbook={editingEbook}
                apiUrl={apiUrl}
            />

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Aksi ini tidak bisa dikembalikan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button onClick={() => {
                            setIsAlertOpen(false)
                            setDeletingEbookId(null)
                        }} variant="outline">Batal</Button>
                        <Button onClick={() => {
                            handleDelete(deletingEbookId)
                            setDeletingEbookId(null)
                        }} variant="destructive">Hapus</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default EbookSection;
