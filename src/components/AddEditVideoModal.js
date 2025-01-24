import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const VideoModal = ({ isOpen, onClose, formData, setFormData, editingId, fetchVideos, apiUrl, toast }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${apiUrl}/video/${editingId}`, formData);
                toast({ title: 'Success', description: 'Video updated successfully.', variant: 'success' });
            } else {
                await axios.post(`${apiUrl}/video`, formData);
                toast({ title: 'Success', description: 'Video added successfully.', variant: 'success' });
            }
            fetchVideos();
            onClose();
        } catch (error) {
            console.error('Failed to save video:', error);
            toast({ title: 'Error', description: 'Failed to save video.', variant: 'error' });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingId ? 'Edit Video' : 'Add Video'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Title</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">YouTube Link</label>
                        <input
                            type="url"
                            className="w-full p-2 border rounded"
                            value={formData.youtube_link}
                            onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onClose} type="button" variant="secondary">Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default VideoModal;
