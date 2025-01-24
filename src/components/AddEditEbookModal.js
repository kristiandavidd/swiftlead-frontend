import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const AddEditEbook = ({ open, onClose, onSubmit, editingEbook, apiUrl }) => {
    const [formData, setFormData] = useState({ title: '', file: null, thumbnail: null });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    useEffect(() => {
        if (editingEbook) {
            setFormData({
                title: editingEbook.title,
                file: null,
                thumbnail: null,
            });
            setThumbnailPreview(editingEbook.thumbnail_path ? `${apiUrl}${editingEbook.thumbnail_path}` : null); // Menampilkan preview thumbnail yang sudah ada
        } else {
            setFormData({ title: '', file: null, thumbnail: null });
            setThumbnailPreview(null);
        }
    }, [editingEbook, apiUrl]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({ ...prev, [name]: files[0] }));

        // Jika file thumbnail, set preview-nya
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
                    <DialogTitle>{editingEbook ? 'Edit Ebook' : 'Add Ebook'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className='mt-3 space-y-1'>
                        <label>Title</label>
                        <Input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className='mt-3 space-y-1'>
                        <label>File</label>
                        <Input type="file" name="file" onChange={handleFileChange} />
                    </div>
                    <div className='mt-3 space-y-1'>
                        <label>Thumbnail</label>
                        <Input type="file" name="thumbnail" onChange={handleFileChange} />
                        {thumbnailPreview && (
                            <div className="my-4">
                                <p>Thumbnail Preview:</p>
                                <Image
                                    src={thumbnailPreview}
                                    alt="Thumbnail Preview"
                                    width={150}
                                    height={150}
                                    className="mx-auto rounded-md"
                                />
                            </div>
                        )}
                    </div>
                    <div className='flex justify-end gap-2 mt-3 space-y-1'>
                        <Button onClick={onClose} variant="secondary">Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEditEbook;
