'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import { api } from '@/app/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    bio?: string;
    location?: string;
    profileImage?: string;
    interests?: string[];
}

import ImageUpload from "@/components/ui/image-upload";
import { X, Plus } from "lucide-react";
import { Badge } from '@/components/ui/badge';

export default function ProfileClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [interests, setInterests] = useState<string[]>([]);
    const [newInterest, setNewInterest] = useState("");
    
    const profileImage = watch('profileImage');

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const decoded: any = jwtDecode(token);
                const res = await api.get(`/users/${decoded.userId}`);
                if (res.data.success) {
                    setUser(res.data.data);
                    reset(res.data.data); // Pre-fill simple fields
                    setInterests(res.data.data.interests || []);
                    if(res.data.data.profileImage) {
                        setValue('profileImage', res.data.data.profileImage);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Error", { description: "Failed to load profile data." });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router, reset, setValue]);

    const handleAddInterest = (e: any) => {
        e.preventDefault();
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest("");
        }
    };

    const handleRemoveInterest = (interest: string) => {
        setInterests(interests.filter(i => i !== interest));
    };

    const onSubmit = async (data: any) => {
        try {
            const token = Cookies.get('accessToken');
            const decoded: any = jwtDecode(token as string);
            
            const payload = { ...data, interests };

            const res = await api.put(`/users/${decoded.userId}`, payload);
            if (res.data.success) {
                toast.success("Profile Updated", {
                    description: "Your changes have been saved successfully."
                });
                setUser(res.data.data); 
            }
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Update Failed", {
                description: "Could not save changes. Please try again."
            });
        }
    };

    if (loading) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
             </div>
         );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                     <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4">
                                <Avatar className="h-32 w-32 border-4 border-indigo-50">
                                    <AvatarImage src={profileImage || user?.profileImage} />
                                    <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-700 font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle>{user?.name}</CardTitle>
                            <CardDescription className="capitalize">{user?.role}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {interests.map(i => (
                                    <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Profile Picture</Label>
                                    <ImageUpload 
                                        value={profileImage || ""} 
                                        onChange={(url) => setValue('profileImage', url)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" {...register('name')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" {...register('email')} disabled className="bg-gray-50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" placeholder="e.g. New York, USA" {...register('location')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input id="bio" placeholder="Tell us about yourself" {...register('bio')} />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Interests</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={newInterest}
                                            onChange={(e) => setNewInterest(e.target.value)}
                                            placeholder="Add an interest (e.g. Hiking)"
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddInterest(e); }}
                                        />
                                        <Button type="button" onClick={handleAddInterest} variant="outline" size="icon">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {interests.map(interest => (
                                            <Badge key={interest} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                                {interest}
                                                <X 
                                                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                                    onClick={() => handleRemoveInterest(interest)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
