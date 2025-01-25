import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import VideoModal from '@/components/AddEditVideoModal';
import Link from 'next/link';
import { IconTrash, IconPencil, IconArrowUpRight } from '@tabler/icons-react';
import MemberLayout from '@/layout/MemberLayout';

const Video = () => {
    const [videos, setVideos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', youtube_link: '' });
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { toast } = useToast();

    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    const fetchVideos = async () => {
        try {
            const res = await axios.get(`${apiUrl}/video`);
            setVideos(res.data[0]);
        } catch (error) {
            console.error('Failed to fetch videos:', error);
            toast({
                title: "Galat!",
                description: "Gagal mengambil data video.",
                variant: "destructive"
            })
        }
    };

    const extractYouTubeID = (url) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.slice(1);
            } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
                return urlObj.searchParams.get('v');
            }
        } catch (error) {
            console.error('Invalid YouTube URL:', url);
            return null;
        }
        return null;
    };

    const truncateText = (text, maxLength) => {
        if (!text || text.length === 0) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    useEffect(() => {
        fetchVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MemberLayout>
            <div className="container p-4 mx-auto">
                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.isArray(videos) && videos.length > 0 ? (
                        videos.map((video) => (
                            <div key={video.id} className="flex flex-col justify-between p-4 bg-white border rounded-lg">
                                <div>
                                    <Image
                                        width={320}
                                        height={180}
                                        src={`https://img.youtube.com/vi/${extractYouTubeID(video.youtube_link) || 'default'}/0.jpg`}
                                        alt={video.title}
                                        className="object-cover w-full h-40 rounded"
                                    />
                                    <h2 className="mt-2 text-lg font-bold">{video.title}</h2>
                                    <p className="text-sm text-gray-600">
                                        {truncateText(video.description, 50)}
                                    </p>
                                </div>
                                <div className="flex justify-end w-full gap-2 mt-4">
                                    <Button variant="outline" className="w-full ">
                                        <Link className='inline-flex items-center gap-2' href={`${video.youtube_link}`} target='_blank'>
                                            <IconArrowUpRight /> Tonton
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Tidak ada konten video ditemukan.</p>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
};

export default Video;
