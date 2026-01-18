'use client';
import { api } from '@/app/lib/api';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, DollarSign, Clock, Users, Edit, Star } from "lucide-react";
import { toast } from "sonner";
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    image?: string;
    additionalImages?: string[];
    organizer: { _id: string, name: string, email: string, profileImage?: string };
    price: number;
    participants: any[];
    maxParticipants: number;
}

export default function EventDetailsClient() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isParticipant, setIsParticipant] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const hasReviewed = reviews.some(r => r.reviewer?._id === userId || r.reviewer === userId);

    useEffect(() => {
        const fetchEventAndReviews = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                if (res.data.success) {
                    setEvent(res.data.data);
                    const token = Cookies.get('accessToken');
                    if (token) {
                        const decoded: any = jwtDecode(token);
                        setUserId(decoded.userId);
                        const isJoined = res.data.data.participants.some((p: any) => p === decoded.userId || p._id === decoded.userId);
                        setIsParticipant(isJoined);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setLoading(false);
            }

            try {
                const reviewRes = await api.get(`/reviews/event/${id}`);
                if (reviewRes.data.success) {
                    setReviews(reviewRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews");
            }
        };

        if (id) fetchEventAndReviews();
    }, [id, router]);

    const handleJoinLeave = async () => {
        const token = Cookies.get('accessToken');
        if (!token) {
            toast.error("Login Required", { description: "Please login to join this event." });
            return;
        }

        try {
            setJoining(true);
            const decoded: any = jwtDecode(token);
            const userId = decoded.userId;

            if (isParticipant) {
                await api.delete(`/events/${id}/join`, { data: { userId } });
                toast.success("Left Event", { description: "You have left the event." });
                setEvent(prev => prev ? { ...prev, participants: prev.participants.filter(p => p !== userId && p._id !== userId) } : null);
                setIsParticipant(false);
            } else {
                if (!event) return;

                if (event.price === 0) {
                    const res = await api.post(`/events/${id}/join`, { userId });
                    if (res.data.success) {
                        toast.success("Joined!", { description: "You validly joined this free event." });
                        setEvent(prev => prev ? { ...prev, participants: [...prev.participants, { _id: userId }] } : null);
                        setIsParticipant(true);
                    }
                } else {
                    const res = await api.post('/payments/create-checkout-session', {
                        eventId: id,
                        userId
                    });
                    if (res.data.success) {
                        window.location.href = res.data.data.url;
                    }
                }
            }
        } catch (error: any) {
            toast.error("Action Failed", { description: error.response?.data?.message || 'Failed to update participation.' });
        } finally {
            setJoining(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) return toast.error("Please select a rating");

        setSubmittingReview(true);
        try {
            const token = Cookies.get('accessToken');
            if (!token) return toast.error("Please login");
            const decoded: any = jwtDecode(token as string);

            const payload = {
                event: id,
                reviewer: decoded.userId,
                rating,
                comment
            };

            const res = await api.post('/reviews', payload);
            if (res.data.success) {
                toast.success("Review Submitted!");

                const newReviewRes = await api.get(`/reviews/event/${id}`);
                if (newReviewRes.data.success) {
                    setReviews(newReviewRes.data.data);
                }

                setRating(0);
                setComment("");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };



    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (!event) return <div className="text-center py-20 text-xl font-medium text-gray-500">Event not found</div>;

    return (
        <div className="bg-background min-h-screen pb-12">
            <div className="h-[400px] w-full bg-gray-200 relative overflow-hidden">

                {event.image ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40">
                        <span className="text-4xl font-bold">Event Banner</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white container mx-auto">
                    <Badge className="bg-primary hover:bg-primary/90 border-none mb-4">{event.category}</Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{event.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-200">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.location}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">About this event</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        {event.additionalImages && event.additionalImages.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.additionalImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                                            <Image
                                                src={img}
                                                alt={`Event gallery ${idx + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <h2 className="text-xl font-bold mb-4">Organizer</h2>
                            <div className="flex items-center space-x-4 p-4 border rounded-2xl bg-card hover:bg-gray-50 transition-colors cursor-pointer group">
                                {event.organizer?.profileImage ? (
                                    <div className="h-12 w-12 rounded-full overflow-hidden relative border border-gray-200 group-hover:scale-105 transition-transform">
                                        <Image
                                            src={event.organizer.profileImage}
                                            alt={event.organizer.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-105 transition-transform">
                                        {event.organizer?.name?.charAt(0) || 'H'}
                                    </div>
                                )}
                                <Link href={`/profile/${event.organizer?._id}`} className="flex-1">
                                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">{event.organizer?.name || 'Unknown Host'}</p>
                                    <p className="text-sm text-muted-foreground">View Profile & Reviews</p>
                                </Link>
                            </div>
                        </div>

                        <div className="pt-8 border-t">
                            <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

                            {userId && userId !== event.organizer?._id && !hasReviewed && (
                                <Card className="mb-8 border-dashed border-2">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Write a Review</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitReview} className="space-y-4">
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-8 w-8 cursor-pointer transition-colors ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                        onClick={() => setRating(star)}
                                                    />
                                                ))}
                                            </div>
                                            <Textarea
                                                placeholder="Share your experience..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows={3}
                                                required
                                            />
                                            <Button type="submit" disabled={submittingReview}>
                                                {submittingReview ? "Submitting..." : "Post Review"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="space-y-4">
                                {reviews.map((review: any) => (
                                    <Card key={review._id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={review.reviewer?.profileImage} />
                                                        <AvatarFallback>{review.reviewer?.name?.charAt(0) || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-sm">{review.reviewer?.name || 'User'}</p>
                                                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                                {reviews.length === 0 && (
                                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border rounded-2xl shadow-sm bg-card p-6 space-y-6 sticky top-24">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                                        <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Time</p>
                                        <p className="font-semibold">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Price</p>
                                        <p className="font-semibold text-xl text-primary">
                                            {event.price > 0 ? `$${event.price}` : 'Free'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary/10 rounded-lg mr-3 text-primary">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Availability</p>
                                        <p className="font-semibold">
                                            {event.participants.length} / {event.maxParticipants} joined
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <Button
                                className={`w-full h-12 text-lg font-semibold shadow-lg transition-all ${isParticipant ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 shadow-none' : 'bg-primary hover:bg-primary/90 hover:shadow-primary/20'}`}
                                onClick={handleJoinLeave}
                                disabled={joining || (!isParticipant && event.participants.length >= event.maxParticipants)}
                            >
                                {joining ? (isParticipant ? 'Leaving...' : 'Joining...') : (isParticipant ? "Leave Event" : (event.participants.length >= event.maxParticipants ? 'Event Full' : 'Join Event'))}
                            </Button>

                            {userId === event.organizer?._id && (
                                <div className="pt-2">
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => router.push(`/events/${id}/edit`)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit Event
                                    </Button>
                                </div>
                            )}

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                {isParticipant ? "You are going to this event!" : "Secure your spot now. 100% Refundable up to 24h before."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
