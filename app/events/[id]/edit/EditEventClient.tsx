'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/app/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar as CalendarIcon, MapPin, DollarSign, Users } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import { toast } from "sonner";

export default function EditEventClient() {
    const router = useRouter();
    const { id } = useParams();
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm();
    const image = watch('image');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
             const token = Cookies.get('accessToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const decoded: any = jwtDecode(token);
                if (decoded.role !== 'host' && decoded.role !== 'admin') {
                     router.push('/dashboard');
                     return;
                }

                const res = await api.get(`/events/${id}`);
                if (res.data.success) {
                    const event = res.data.data;
                    if(event.organizer._id !== decoded.userId && decoded.role !== 'admin') {
                         toast.error("Unauthorized");
                         router.push('/my-events');
                         return;
                }

                    const dateObj = new Date(event.date);
                    const formattedDate = dateObj.toISOString().split('T')[0];

                    reset({
                        ...event,
                        date: formattedDate,
                        image: event.image || '',
                        price: event.price || 0
                    });
                }
            } catch (error) {
                console.error("Fetch error", error);
                toast.error("Error", { description: "Failed to load event details." });
                router.push('/my-events');
            } finally {
                setLoading(false);
            }
        };

        if(id) fetchEvent();
    }, [id, router, reset]);


    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                date: new Date(`${data.date}T${data.time}`),
            };

            const res = await api.put(`/events/${id}`, payload);
            if (res.data.success) {
                toast.success("Event Updated!", { description: "Changes saved successfully." });
                router.push('/my-events');
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Update Failed", { description: error.response?.data?.message || "Could not update event." });
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Edit Event</CardTitle>
                    <CardDescription>Update the details of your event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input id="title" {...register('title', { required: true })} />
                                    {errors.title && <span className="text-xs text-red-500">Title is required</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category/Type</Label>
                                    <select 
                                        id="category"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register('category', { required: true })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Social">Social</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Outdoors">Outdoors</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Food">Food & Drink</option>
                                        <option value="Arts">Arts & Culture</option>
                                    </select>
                                    {errors.category && <span className="text-xs text-red-500">Category is required</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" rows={5} {...register('description', { required: true })} />
                                {errors.description && <span className="text-xs text-red-500">Description is required</span>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" {...register('date', { required: true })} />
                                    {errors.date && <span className="text-xs text-red-500">Date is required</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input id="time" type="time" {...register('time', { required: true })} />
                                    {errors.time && <span className="text-xs text-red-500">Time is required</span>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input id="location" className="pl-10" {...register('location', { required: true })} />
                                </div>
                                {errors.location && <span className="text-xs text-red-500">Location is required</span>}
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxParticipants">Max Participants</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input id="maxParticipants" type="number" min="2" className="pl-10" {...register('maxParticipants', { required: true, min: 2 })} />
                                    </div>
                                    {errors.maxParticipants && <span className="text-xs text-red-500">Required</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Joining Fee ($)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input id="price" type="number" min="0" className="pl-10" {...register('price', { required: true, min: 0 })} />
                                    </div>
                                </div>
                                <div className="space-y-2 col-span-3 md:col-span-1">
                                    <Label>Event Image</Label>
                                    <ImageUpload 
                                        value={image} 
                                        onChange={(url) => setValue('image', url)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" className="w-1/3" onClick={() => router.push('/my-events')}>
                                Cancel
                            </Button>
                            <Button type="submit" className="w-2/3 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                                {isSubmitting ? "Saving Changes..." : "Update Event"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
