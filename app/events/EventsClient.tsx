"use client";
import { api } from "@/app/lib/api";
import { useEffect, useState, Suspense } from "react"; // Added Suspense
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function EventsClient() {
    return (
        <Suspense
            fallback={<div className="flex justify-center py-12">Loading...</div>}
        >
            <EventsContentWrapper />
        </Suspense>
    );
}

function EventsContentWrapper() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [meta, setMeta] = useState({
        page: 1,
        limit: 9,
        total: 0,
        totalPage: 1,
    });
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // URL Params
    const category = searchParams.get("category") || "";
    const date = searchParams.get("date") || "";
    const location = searchParams.get("location") || "";
    const searchTerm = searchParams.get("searchTerm") || "";
    const page = Number(searchParams.get("page")) || 1;
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (category) queryParams.set("category", category);
                if (date) queryParams.set("date", date);
                if (location) queryParams.set("location", location);
                if (searchTerm) queryParams.set("searchTerm", searchTerm);
                queryParams.set("page", page.toString());
                queryParams.set("limit", "9");
                queryParams.set("sortBy", sortBy);
                queryParams.set("sortOrder", sortOrder);

                const res = await api.get(`/events?${queryParams.toString()}`);
                if (res.data.success) {
                    setEvents(res.data.data);
                    setMeta(res.data.meta);
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [category, date, location, searchTerm, page, sortBy, sortOrder]);

    const updateFilters = (newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // Reset to page 1 on filter change (uniess page is explicitly set)
        if (!newParams.page) {
            params.set("page", "1");
        }

        router.push(`/events?${params.toString()}`);
    };

    // Simplified local filtering removed in favor of Server Side
    const filteredEvents = events; // filteredEvents is just events now as API handles it

    const categories = [
        "All",
        "Social",
        "Sports",
        "Outdoors",
        "Gaming",
        "Food",
        "Arts",
    ];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10 space-y-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-64 space-y-6 flex-shrink-0">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <EventCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Explore Events
                </h1>
                <p className="text-muted-foreground mt-2">
                    Find and join activities that match your interests.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 space-y-6 flex-shrink-0">
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <h3 className="font-semibold mb-4 text-foreground">Filters</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-foreground">
                                    Category
                                </label>
                                <select
                                    className="w-full p-2 border border-input rounded-md text-sm bg-background"
                                    value={category}
                                    onChange={(e) =>
                                        updateFilters({ category: e.target.value, page: "1" })
                                    }
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sorting */}
                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-foreground">
                                    Sort By
                                </label>
                                <select
                                    className="w-full p-2 border border-input rounded-md text-sm bg-background"
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [newSort, newOrder] = e.target.value.split("-");
                                        updateFilters({
                                            sortBy: newSort,
                                            sortOrder: newOrder,
                                            page: "1",
                                        });
                                    }}
                                >
                                    <option value="date-desc">Newest First</option>
                                    <option value="date-asc">Oldest First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-foreground">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search location..."
                                    className="w-full p-2 border border-input rounded-md text-sm bg-background"
                                    value={location}
                                    onChange={(e) => updateFilters({ location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-foreground">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-input rounded-md text-sm bg-background"
                                    value={date}
                                    onChange={(e) =>
                                        updateFilters({ date: e.target.value, page: "1" })
                                    }
                                />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push("/events")}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    {searchTerm && (
                        <p className="mb-4 text-sm text-muted-foreground">
                            Showing results for "{searchTerm}"
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Card
                                key={event._id}
                                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                            >
                                <div className="h-48 bg-muted relative group">
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
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}
                                    <Badge className="absolute top-4 right-4 bg-background/90 text-primary hover:bg-background/100 shadow-sm backdrop-blur-sm">
                                        {event.category}
                                    </Badge>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-medium text-primary flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {event.price > 0 ? `$${event.price}` : "Free"}
                                        </p>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight mt-1 line-clamp-1">
                                        {event.title}
                                    </h3>
                                </CardHeader>
                                <CardContent className="flex-grow pb-2">
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4">
                                    <Button
                                        asChild
                                        className="w-full bg-primary hover:bg-primary/90 font-medium"
                                    >
                                        <Link href={`/events/${event._id}`}>View Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {meta.totalPage > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <Button
                                variant="outline"
                                disabled={meta.page <= 1}
                                onClick={() =>
                                    updateFilters({ page: (meta.page - 1).toString() })
                                }
                            >
                                Previous
                            </Button>
                            <span className="text-sm font-medium">
                                Page {meta.page} of {meta.totalPage}
                            </span>
                            <Button
                                variant="outline"
                                disabled={meta.page >= meta.totalPage}
                                onClick={() =>
                                    updateFilters({ page: (meta.page + 1).toString() })
                                }
                            >
                                Next
                            </Button>
                        </div>
                    )}

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
                            <p className="text-muted-foreground text-lg">
                                No events match your criteria.
                            </p>
                            <Button
                                variant="link"
                                className="mt-2 text-primary"
                                onClick={() => router.push("/events")}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EventCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full flex flex-col overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-6 space-y-4 flex-grow">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="p-6 pt-0">
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
    )
}
