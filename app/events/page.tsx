'use client';
import { api } from '@/app/lib/api';
import { useEffect, useState, Suspense } from 'react'; // Added Suspense
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from 'next/image';

interface Event {
    _id: string;
    title: string;
    description?: string;
    date: string;
    location: string;
    category: string;
    image?: string;
    price: number;
}

function EventsContent() {
    const searchParams = useSearchParams();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    
    // Filters initialized from URL
    const [category, setCategory] = useState(searchParams.get('category') || "");
    const [date, setDate] = useState(searchParams.get('date') || "");
    const [location, setLocation] = useState(searchParams.get('location') || "");
    const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || "");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                if (res.data.success) {
                    setEvents(res.data.data);
                    // Initial filtering will happen in the next effect
                }
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;

        if (category && category !== "All") {
            result = result.filter(e => e.category === category);
        }

        if (date) {
            result = result.filter(e => new Date(e.date).toISOString().split('T')[0] === date);
        }

        if (location) {
            result = result.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (searchTerm) {
             result = result.filter(e => 
                e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                e.description?.toLowerCase().includes(searchTerm.toLowerCase())
             );
        }

        setFilteredEvents(result);
    }, [category, date, location, searchTerm, events]);
    
    // ... rest of component logic ...
    
    // Need to return the JSX here, duplicating the previous return
    // Since I can't easily wrap the whole file with replace_file_content without reposting 200 lines, 
    // I will use a different strategy. I will inject `useSearchParams` into the existing component
    // and just wrap the export default at the bottom.
    
    // WAIT, `replace_file_content` is limited.
    // I will just modify the top of the component to us `useSearchParams` 
    // AND then I'll add the Suspense wrapper at the end of the file.
    
    return { events, loading, filteredEvents, setCategory, setLocation, setDate, category, location, date };
}

// ... actually, partial replacement of function body is risky if I change structure.
// I will just add the search logic to the existing component and then handle the Suspense boundary 
// by renaming the default export.

export default function EventsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventsContentWrapper />
        </Suspense>
    );
}

function EventsContentWrapper() {
    const searchParams = useSearchParams();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    
    // Filters
    const [category, setCategory] = useState(searchParams.get('category') || "");
    const [date, setDate] = useState(searchParams.get('date') || "");
    const [location, setLocation] = useState(searchParams.get('location') || "");
    const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || "");
    
    // ... Copy logic of useEffects ...
    useEffect(() => {
        const fetchEvents = async () => {
             // ...
             try {
                const res = await api.get('/events');
                if (res.data.success) {
                    setEvents(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;

        if (category && category !== "All") {
            result = result.filter(e => e.category === category);
        }

        if (date) {
            result = result.filter(e => new Date(e.date).toISOString().split('T')[0] === date);
        }

        if (location) {
            result = result.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));
        }
        
         if (searchTerm) {
             result = result.filter(e => 
                e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
               // e.description.toLowerCase().includes(searchTerm.toLowerCase()) // Description might be missing from list type
                (e as any).description?.toLowerCase().includes(searchTerm.toLowerCase())
             );
        }

        setFilteredEvents(result);
    }, [category, date, location, searchTerm, events]);


    const categories = ["All", "Social", "Sports", "Outdoors", "Gaming", "Food", "Arts"];

    if (loading) {
         return (
             <div className="flex items-center justify-center min-h-screen">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
             </div>
         );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Same JSX as before */}
            <div className="mb-10">
                 <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Explore Events</h1>
                 <p className="text-muted-foreground mt-2">Find and join activities that match your interests.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 space-y-6 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-semibold mb-4">Filters</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Category</label>
                                <select 
                                    className="w-full p-2 border rounded-md text-sm"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Location</label>
                                <input 
                                    type="text" 
                                    placeholder="Search location..." 
                                    className="w-full p-2 border rounded-md text-sm"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-2 border rounded-md text-sm"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => { setCategory(""); setLocation(""); setDate(""); setSearchTerm(""); }}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Event Grid */}
                <div className="flex-1">
                     {/* Search Result Header if search term exists */}
                     {searchTerm && <p className="mb-4 text-sm text-gray-500">Showing results for "{searchTerm}"</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Card key={event._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                                <div className="h-48 bg-gray-100 relative group">
                                    {event.image ? (
                                        <div className="relative w-full h-full">
                                            <Image 
                                                src={event.image} 
                                                alt={event.title} 
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}
                                     <Badge className="absolute top-4 right-4 bg-white/90 text-indigo-700 hover:bg-white/100 shadow-sm backdrop-blur-sm">
                                        {event.category}
                                    </Badge>
                                </div>
                                <CardHeader className="pb-2">
                                     <div className="flex justify-between items-start">
                                         <p className="text-sm font-medium text-indigo-600 flex items-center">
                                             <Calendar className="w-4 h-4 mr-1" />
                                             {new Date(event.date).toLocaleDateString()}
                                         </p>
                                          <p className="text-sm font-semibold text-gray-900">
                                             {event.price > 0 ? `$${event.price}` : 'Free'}
                                         </p>
                                     </div>
                                    <h3 className="text-xl font-bold leading-tight mt-1 line-clamp-1">{event.title}</h3>
                                </CardHeader>
                                <CardContent className="flex-grow pb-2">
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4">
                                    <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium">
                                        <Link href={`/events/${event._id}`}>View Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-muted-foreground text-lg">No events match your criteria.</p>
                            <Button variant="link" className="mt-2 text-indigo-600" onClick={() => { setCategory(""); setLocation(""); setDate(""); setSearchTerm(""); }}>Clear Filters</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
