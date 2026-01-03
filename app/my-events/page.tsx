'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { api } from '@/app/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Event {
    _id: string;
    title: string;
    date: string;
    location: string;
    status: string;
    participants: string[];
    maxParticipants: number;
}

export default function MyEventsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchEvents = async () => {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.role !== 'host' && decoded.role !== 'admin') {
                     toast.error("Access Denied", { description: "You must be a host to view this page." });
                     router.push('/dashboard');
                     return;
                }

                const res = await api.get(`/events?organizer=${decoded.userId}`);
                if (res.data.success) {
                    setEvents(res.data.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Error", { description: "Failed to fetch your events." });
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [router]);

    if (loading) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
             </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
                    <p className="text-gray-500 mt-1">Manage the events you are hosting.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                    <Link href="/events/create">Create New Event</Link>
                </Button>
            </div>

            {events.length === 0 ? (
                <Card className="text-center py-12">
                    <CardHeader>
                        <CardTitle>No Events Found</CardTitle>
                        <CardDescription>You haven't created any events yet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                            <Link href="/events/create">Host Your First Event</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {events.map((event) => (
                        <Card key={event._id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="bg-indigo-50 p-6 flex flex-col justify-center items-center w-full md:w-48 text-center border-b md:border-b-0 md:border-r border-indigo-100">
                                        <span className="text-2xl font-bold text-indigo-600">{new Date(event.date).getDate()}</span>
                                        <span className="text-indigo-600 font-medium uppercase text-sm">
                                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-gray-500 text-xs mt-1">
                                            {new Date(event.date).getFullYear()}
                                        </span>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                                <Badge className={
                                                    event.status === 'open' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                    event.status === 'full' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' : 'bg-gray-100 text-gray-700'
                                                }>
                                                    {event.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" /> {event.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" /> {event.participants.length} / {event.maxParticipants} Joined
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-4 md:mt-0">
                                            <Button variant="outline" size="sm" asChild>
                                                 <Link href={`/events/${event._id}`}>View Details</Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                 <Link href={`/events/${event._id}/edit`}>
                                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                                 </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
