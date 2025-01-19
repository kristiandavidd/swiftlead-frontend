"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layout/GuestLayout';
import { useUser } from '@/context/userContext';
import { toast } from '@/hooks/use-toast';
import { set } from 'react-hook-form';
import { IconTrash } from '@tabler/icons-react';
import { AlertDialog, AlertDialogTitle, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog';

const ArticlePreview = () => {
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [comments, setComments] = useState([]);
    const { user } = useUser();
    const [newComment, setNewComment] = useState({ user_id: '', content: '' });
    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_PROD_URL
        : process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (id) {
            fetchArticle();
            fetchRecommendations();
            fetchComments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchArticle = async () => {
        try {
            const response = await axios.get(`${apiUrl}/articles/${id}`);
            setArticle(response.data[0]);
        } catch (error) {
            console.error('Error fetching article:', error);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get(`${apiUrl}/articles/${id}/recommendations`);
            setRecommendations(response.data[0]);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${apiUrl}/articles/${id}/comments`);
            setComments(response.data[0]);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    console.log(comments)

    const handleAddComment = async () => {
        setNewComment({ ...newComment, user_id: user.id });
        console.log(newComment)
        if (newComment.user_id && newComment.content) {
            try {
                await axios.post(`${apiUrl}/articles/${id}/comments`, newComment);
                setNewComment({ user_id: '', content: '' });
                fetchComments();
                toast({ title: 'Success', description: 'Comment added successfully', variant: 'success' });
            } catch (error) {
                console.error('Error adding comment:', error);
                toast({ title: 'Error', description: 'Failed to add comment', variant: 'destructive' });
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`${apiUrl}/articles/comments/${commentId}`, { user_id: user.id, user_role: user.role }, {
                headers: { Authorization: `Bearer ${user.token}` }, // Sertakan token autentikasi
            });

            toast({ title: "Success", description: "Comment deleted successfully", variant: "success" });
            fetchComments(); // Refresh komentar
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast({ title: "Error", description: "Failed to delete comment", variant: "destructive" });
        }
    };


    if (!article) return <p>Loading...</p>;

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

    return (
        <GuestLayout>
            <div className="max-w-3xl p-6 mx-auto mt-4 bg-white rounded-md shadow-md">
                <h1 className="mb-4 text-3xl font-bold text-center">{article.title}</h1>
                {article.cover_image && (
                    <Image
                        src={`${apiUrl}${article.cover_image}`}
                        alt={article.title}
                        className="object-cover mx-auto mt-6 mb-6 rounded-md max-h-96"
                        width={800}
                        height={400}
                    />
                )}
                <div dangerouslySetInnerHTML={{ __html: article.content }} className="text-justify" />

                {/* Recommendations */}
                <div className="mt-10">
                    <h2 className="mb-4 text-2xl font-bold">Recommended Articles</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {recommendations.map((rec) => (
                            <Link key={rec.id} href={`/article/${rec.id}`} className="p-4 border rounded-md hover:shadow-md">
                                {rec.cover_image && (
                                    <Image
                                        src={`${apiUrl}${rec.cover_image}`}
                                        alt={rec.title}
                                        className="mb-4 rounded-md"
                                        width={400}
                                        height={200}
                                    />
                                )}
                                <h3 className="text-lg font-semibold">{rec.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {truncateText(stripHtmlTags(rec.content), 40)}...
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Comments */}
                {
                    user ? (
                        <div className="mt-10">
                            <h2 className="mb-4 text-2xl font-bold">Comments</h2>
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={user.name}
                                    onChange={(e) => setNewComment(user.user_id)}
                                    className="block w-full px-4 py-2 mb-2 border rounded-md"
                                    disabled
                                />
                                <textarea
                                    placeholder="Write a comment..."
                                    value={newComment.content}
                                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value, user_id: user.id })}
                                    className="block w-full px-4 py-2 mb-2 border rounded-md"
                                />
                                <Button onClick={handleAddComment}>Post Comment</Button>
                            </div>
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="relative flex items-center justify-between p-4 border rounded-md">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-500">{user.id === comment.user_id ? "You" : comment.author}</p>
                                            <p className="">{comment.content}</p>
                                        </div>
                                        {user.id === comment.user_id || user.role === 1 ? (
                                            < div >
                                                < AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" className="w-1/5" >
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
                                                            <AlertDialogAction onClick={() => handleDeleteComment(comment.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                        </div>

                    ) : (
                        <p className="mt-6 text-center">Please <Link href="/login" className="text-blue-500">login</Link> to post a comment</p>
                    )}
            </div>
        </GuestLayout >
    );
};

export default ArticlePreview;
