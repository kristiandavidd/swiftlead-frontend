import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import AddEditEbook from '@/components/AddEditEbookModal';
import { IconArrowUpRight, IconPencil, IconTrash } from '@tabler/icons-react';

const EbookSection = () => {
    const [ebooks, setEbooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [editingEbook, setEditingEbook] = useState(null);
    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    const fetchEbooks = async () => {
        try {
            const res = await axios.get(`${apiUrl}/ebook`);
            setEbooks(res.data);
        } catch (error) {
            console.error('Error fetching ebooks:', error);
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
        } catch (error) {
            console.error('Error saving ebook:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/ebook/${id}`);
            fetchEbooks();
            setIsAlertOpen(false);
        } catch (error) {
            console.error('Error deleting ebook:', error);
        }
    };

    useEffect(() => {
        fetchEbooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container p-4 mx-auto">
            <Button onClick={() => setIsModalOpen(true)}>Add Ebook</Button>
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
                                    <IconArrowUpRight /> Preview
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
                            <Button className="w-1/4" onClick={() => setIsAlertOpen(true)} variant="destructive">
                                <IconTrash />
                            </Button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Add/Edit Ebook Modal */}
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

            {/* Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button onClick={() => setIsAlertOpen(false)} variant="secondary">Cancel</Button>
                        <Button onClick={() => handleDelete(editingEbook?.id)} variant="destructive">Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default EbookSection;
