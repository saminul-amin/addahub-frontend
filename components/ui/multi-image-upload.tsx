'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { toast } from 'sonner';

interface MultiImageUploadProps {
    values: string[];
    onChange: (values: string[]) => void;
}

export default function MultiImageUpload({ values = [], onChange }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Reusing the same upload endpoint
            const response = await fetch('https://addahub-backend.vercel.app/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                onChange([...values, data.data.url]);
                toast.success("Image uploaded!");
            } else {
                toast.error("Upload failed", { description: data.message });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Upload Error", { description: "Something went wrong." });
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(values.filter(url => url !== urlToRemove));
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Upload additional images ->"
                        readOnly
                        className="pl-10 text-muted-foreground"
                    />
                </div>
                <div className="relative">
                    <Button type="button" variant="outline" disabled={uploading} className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Add Image'}
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </div>
            </div>

            {values.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {values.map((url, index) => (
                        <div key={index} className="relative aspect-video w-full rounded-md overflow-hidden border bg-gray-100 group">
                            <img src={url} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(url)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
