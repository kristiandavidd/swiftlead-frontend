import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import AddEditEbook from '@/components/AddEditEbookModal';
import { IconArrowUpRight, IconPencil, IconDownload } from '@tabler/icons-react';
import MemberLayout from '@/layout/MemberLayout';

const Ebook = () => {
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
    const downloadEbook = (ebookUrl, ebookName) => {

        // using Java Script method to get PDF file
        fetch(ebookUrl).then((response) => {
            response.blob().then((blob) => {

                // Creating new object of PDF file
                const fileURL =
                    window.URL.createObjectURL(blob);

                // Setting various property values
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = ebookName;
                alink.click();
            });
        });
    };

    useEffect(() => {
        fetchEbooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MemberLayout>
            <div className="container p-4 mx-auto">
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

                                <Button className="w-3/4 bg-white" variant="outline">
                                    <Link href={`${apiUrl}${ebook.file_path}`} target="_blank" className='inline-flex items-center gap-2 '>
                                        <IconArrowUpRight /> Baca
                                    </Link>
                                </Button>
                                <Button className="w-1/4" onClick={downloadEbook(`${apiUrl}${ebook.file_path}`, ebook.title)} >
                                    <IconDownload />
                                </Button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </MemberLayout>
    );
};

export default Ebook;
