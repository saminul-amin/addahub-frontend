'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Calendar, Mail } from "lucide-react";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function PublicProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [showReviewDialog, setShowReviewDialog] = useState(false);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                setCurrentUser(jwtDecode(token));
            } catch (e) {}
        }

        const fetchData = async () => {
             if(typeof id !== 'string') return;
             try {
                 const userRes = await api.get(`/users/${id}`);
                 if (userRes.data.success) {
                    setUser(userRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmitReview = async () => {
        if (!currentUser) return router.push('/login');
        try {
            const res = await api.post('/reviews', {
                reviewer: currentUser.userId,
                host: id,
                rating,
                comment
            });
            if (res.data.success) {
                toast.success("Review Submitted");
                setReviews([...reviews, res.data.data]);
                setShowReviewDialog(false);
            }
        } catch (error: any) {
            toast.error("Failed to submit review");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
        : "New";

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left space-y-2">
                        <CardTitle className="text-3xl">{user.name}</CardTitle>
                        <div className="flex items-center justify-center md:justify-start text-gray-500 gap-2">
                            <MapPin className="h-4 w-4" /> {user.location || "Location not set"}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{averageRating}</span>
                            <span className="text-gray-500">({reviews.length} reviews)</span>
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="py-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">About</h3>
                        <p className="text-gray-600">{user.bio || "No bio information provided."}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.interests && user.interests.length > 0 ? (
                                user.interests.map((interest: string) => (
                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No interests listed.</span>
                            )}
                        </div>
                    </div>

                    {/* Reviews Removed from Profile Page as per request */}
                </CardContent>
            </Card>
        </div>
    );
}
