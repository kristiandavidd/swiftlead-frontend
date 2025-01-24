import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function VideoModal({ isOpen, onClose, formData, setFormData, editingId, fetchVideos, apiUrl, toast }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${apiUrl}/video/${editingId}`, formData);
                toast({ title: 'Sukses!', description: 'Video berhasil diperbarui.', variant: 'success' });
            } else {
                await axios.post(`${apiUrl}/video`, formData);
                toast({ title: 'Sukses!', description: 'Video berhasil ditambahkan.', variant: 'success' });
            }
            fetchVideos();
            onClose();
        } catch (error) {
            console.error('Failed to save video:', error);
            toast({ title: 'Galat!', description: 'Gagal menyimpan video.', variant: 'error' });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingId ? 'Mengubah Video' : 'Menambahkan Video'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Judul video</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder='Judul video yang menarik..'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Deskripsi video</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder='Deskripsi video..'
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Tautan YouTube</label>
                        <input
                            type="url"
                            className="w-full p-2 border rounded"
                            value={formData.youtube_link}
                            onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                            placeholder='Tautkan video YouTube..'
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onClose} type="button" variant="secondary">Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
