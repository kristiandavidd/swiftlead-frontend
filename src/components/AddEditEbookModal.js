import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { IconInfoCircle } from '@tabler/icons-react';

export default function AddEditEbook({ open, onClose, onSubmit, editingEbook, apiUrl }) {
    const [formData, setFormData] = useState({ title: '', file: null, thumbnail: null });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    useEffect(() => {
        if (editingEbook) {
            setFormData({
                title: editingEbook.title,
                file: null,
                thumbnail: null,
            });
            setThumbnailPreview(editingEbook.thumbnail_path ? `${apiUrl}${editingEbook.thumbnail_path}` : null);
        } else {
            setFormData({ title: '', file: null, thumbnail: null });
            setThumbnailPreview(null);
        }
    }, [editingEbook, apiUrl]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({ ...prev, [name]: files[0] }));

        if (name === 'thumbnail') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => setThumbnailPreview(reader.result);
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingEbook ? 'Mengedit Ebook' : 'Menambahkan Ebook'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className='mt-3 space-y-1'>
                        <label>Judul E-Book</label>
                        <Input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Judul E-Book.."
                            required
                        />
                    </div>
                    <div className='mt-3 space-y-1'>
                        <label>Unggah E-Book</label>
                        <p className='flex items-center gap-1 text-sm text-muted-foreground'><IconInfoCircle size={16}></IconInfoCircle> Pastikan file bertipe PDF berukuran kurang dari 10 MB</p>
                        <Input type="file" name="file" onChange={handleFileChange} />
                    </div>
                    <div className='mt-3 space-y-1'>
                        <label>Sampul E-Book</label>
                        <p className='flex items-center gap-1 text-sm text-muted-foreground'><IconInfoCircle size={16}></IconInfoCircle> Pastikan file bertipe jpg/png berukuran kurang dari 1 MB</p>
                        <Input type="file" name="thumbnail" onChange={handleFileChange} />
                        {thumbnailPreview && (
                            <div className="my-4">
                                <p>Pratinjau sampul:</p>
                                <Image
                                    src={thumbnailPreview}
                                    alt="Pratinjau sampul"
                                    width={150}
                                    height={150}
                                    className="mx-auto rounded-md"
                                />
                            </div>
                        )}
                    </div>
                    <div className='flex items-center justify-end gap-2 mt-3 space-y-1'>
                        <Button onClick={onClose} variant="outline">Batal</Button>
                        <Button type="submit">Unggah</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
