'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload } from "lucide-react";
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
             const response = await fetch('https://addahub-backend.vercel.app/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();

            if (data.success) {
                onChange(data.data.url);
                toast.success("Image uploaded!");
            } else {
                toast.error("Upload failed", { description: data.message });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Upload Error", { description: "Something went wrong." });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Image URL (or upload file ->)" 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="relative">
                    <Button type="button" variant="outline" disabled={uploading} className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload'}
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
            {value && (
                <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-gray-100">
                    <img src={value} alt="Preview" className="object-cover w-full h-full" />
                </div>
            )}
        </div>
    );
}
