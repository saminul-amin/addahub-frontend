"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { api } from "@/app/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Calendar,
  ListTodo,
  MapPin,
  User as UserIcon,
  Mail,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  status: string;
}

export default function DashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);

  // Admin States
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [allHosts, setAllHosts] = useState<UserData[]>([]);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        const userRes = await api.get(`/users/${userId}`);
        if (userRes.data.success) {
          const userData = userRes.data.data;
          setUser(userData);

          if (userData.role === "admin") {
            const usersRes = await api.get("/users");
            if (usersRes.data.success) {
              const users = usersRes.data.data;
              setAllUsers(users);
              setAllHosts(users.filter((u: any) => u.role === "host"));
            }
            const eventsRes = await api.get("/events");
            if (eventsRes.data.success) {
              setAllEvents(eventsRes.data.data);
            }
          }
        }

        const joinedRes = await api.get(`/events?participants=${userId}`);
        if (joinedRes.data.success) {
          setJoinedEvents(joinedRes.data.data);
        }
        const hostedRes = await api.get(`/events?organizer=${userId}`);
        if (hostedRes.data.success) {
          setHostedEvents(hostedRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${userId}`);
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
      setAllHosts((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${eventId}`);
      setAllEvents((prev) => prev.filter((e) => e._id !== eventId));
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen bg-muted/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "admin"
              ? "Admin Dashboard Control Center"
              : "Here's what's happening with your events."}
          </p>
        </div>
        {user?.role === "host" || user?.role === "admin" ? (
          <Button className="bg-primary hover:bg-primary/90 shadow-sm" asChild>
            <Link href="/events/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Event
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="border-border shadow-md sticky top-24">
            <CardHeader className="items-center text-center pb-2">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl mb-4">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription className="capitalize badge badge-secondary mt-2 inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                {user?.role} Account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4 mr-3 text-primary" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs
            defaultValue={user?.role === "admin" ? "overview" : "joined"}
            className="space-y-6"
          >
            <TabsList className="bg-card p-1 rounded-lg border border-border shadow-sm w-full md:w-auto grid grid-cols-3 md:flex flex-wrap h-auto">
              {user?.role === "admin" && (
                <>
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
                  >
                    Manage Users
                  </TabsTrigger>
                  <TabsTrigger
                    value="hosts"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
                  >
                    Manage Hosts
                  </TabsTrigger>
                  <TabsTrigger
                    value="manage_events"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
                  >
                    Manage Events
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger
                value="joined"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
              >
                {user?.role === "admin" ? "My Joined" : "Joined Events"}
              </TabsTrigger>
              <TabsTrigger
                value="hosting"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2"
              >
                {user?.role === "admin" ? "My Hosting" : "Hosting"}
              </TabsTrigger>
            </TabsList>

            {user?.role === "admin" && (
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {allUsers.filter((u) => u.role === "user").length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Registered standard users
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Hosts
                      </CardTitle>
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {allUsers.filter((u) => u.role === "host").length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Active event organizers
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Events
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {allEvents.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Published on platform
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            {user?.role === "admin" && (
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                    <CardDescription>
                      View and manage registered users (filtering hosts out).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allUsers
                        .filter((u) => u.role === "user")
                        .map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-semibold">{u.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {u.email}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                {u.role}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      {allUsers.filter((u) => u.role === "user").length ===
                        0 && (
                        <p className="text-muted-foreground text-center py-4">
                          No users found.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {user?.role === "admin" && (
              <TabsContent value="hosts">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Hosts</CardTitle>
                    <CardDescription>
                      View and manage event organizers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allUsers
                        .filter((u) => u.role === "host")
                        .map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-semibold">{u.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {u.email}
                              </p>
                              <Badge
                                variant="outline"
                                className="mt-1 border-primary/20 text-primary bg-primary/10"
                              >
                                {u.role}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      {allUsers.filter((u) => u.role === "host").length ===
                        0 && (
                        <p className="text-muted-foreground text-center py-4">
                          No hosts found.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {user?.role === "admin" && (
              <TabsContent value="manage_events">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage All Events</CardTitle>
                    <CardDescription>
                      View, edit, or delete events.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allEvents.map((e) => (
                        <div
                          key={e._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{e.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(e.date).toLocaleDateString()} •{" "}
                              {e.status}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/events/${e._id}/edit`}>Edit</Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteEvent(e._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {allEvents.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                          No events found.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="joined">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Upcoming Activities</CardTitle>
                      <CardDescription>
                        Events you have booked a spot for.
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-primary bg-primary/10"
                    >
                      {joinedEvents.length} Events
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {joinedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {joinedEvents.map((event) => (
                        <div
                          key={event._id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <Link
                                href={`/events/${event._id}`}
                                className="font-semibold hover:text-primary transition-colors"
                              >
                                {event.title}
                              </Link>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />{" "}
                                {event.location}
                                <span className="mx-2">•</span>
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/events/${event._id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/40 rounded-xl border-2 border-dashed">
                      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground">
                        No upcoming events
                      </h3>
                      <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
                        You haven't joined any events yet. Check out what's
                        happening nearby!
                      </p>
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => router.push("/events")}
                      >
                        Find Events
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hosting">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>My Events</CardTitle>
                      <CardDescription>
                        Events you are organizing.
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-primary bg-primary/10"
                    >
                      {hostedEvents.length} Events
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {hostedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {hostedEvents.map((event) => (
                        <div
                          key={event._id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                              <ListTodo className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <Link
                                href={`/events/${event._id}`}
                                className="font-semibold hover:text-primary transition-colors"
                              >
                                {event.title}
                              </Link>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <span className="capitalize px-2 py-0.5 rounded-full bg-muted text-xs font-medium border mr-2">
                                  {event.status}
                                </span>
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/events/${event._id}/edit`}>
                              Manage
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/40 rounded-xl border-2 border-dashed">
                      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <ListTodo className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground">
                        No events hosted
                      </h3>
                      <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
                        You haven't created any events yet. Start building your
                        community!
                      </p>
                      {user?.role === "host" || user?.role === "admin" ? (
                        <Link href="/events/create">
                          <Button className="bg-primary hover:bg-primary/90">
                            Create My First Event
                          </Button>
                        </Link>
                      ) : (
                        <p className="text-sm text-orange-600 bg-orange-500/10 px-4 py-2 rounded-lg">
                          You need a Host account to create events.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
