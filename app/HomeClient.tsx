"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "./lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Calendar,
  Users,
  Star,
  Search,
  MapPin,
  CheckCircle2,
  Search as SearchIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { MockCardStack } from "@/app/components/MockCardStack";
import TopHost from "@/public/top-host.jpeg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomeClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [popularEvents, setPopularEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const response = await api.get("/events?limit=3");
        if (response.data.success) {
          setPopularEvents(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch popular events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularEvents();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (location) params.append("location", location);
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-12 pb-12 md:pt-12 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 text-center lg:text-left">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                Turn your interests into <br />
                <span className="text-primary">real-world connections</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Don't do it alone. Find companions for hiking, gaming, dining,
                and more. Join a community of thousands making new friends every
                day at <strong>AddaHub</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 text-base shadow-lg shadow-primary/25"
                  asChild
                >
                  <Link href="/events">Explore Events</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-base hover:bg-secondary/80"
                  asChild
                >
                  <Link href="/events/create">Host an Event</Link>
                </Button>
              </div>
            </motion.div>

            <div className="relative h-[600px] hidden lg:block overflow-hidden">
              <MockCardStack items={popularEvents.slice(0, 3)} />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card p-4 rounded-2xl shadow-xl shadow-muted/20 border border-border max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search for events..."
                className="pl-10 h-12 border-input bg-muted/50 focus:bg-background transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-1/3">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Location (e.g. Dhaka)"
                className="pl-10 h-12 border-input bg-muted/50 focus:bg-background transition-colors"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button
              size="lg"
              className="w-full md:w-auto px-8 h-12 rounded-xl"
              asChild
            >
              <Link href={`/events?search=${searchTerm}&location=${location}`}>
                Find
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How AddaHub Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to get you connected with your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Discover",
                desc: "Browse through hundreds of local events tailored to your interests.",
              },
              {
                icon: Calendar,
                title: "Book",
                desc: "Secure your spot in seconds with our easy booking system.",
              },
              {
                icon: Users,
                title: "Connect",
                desc: "Meet new people and build lasting friendships in real life.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4 text-center group hover:-translate-y-1"
              >
                <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Find the perfect activity for your mood
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Social", "Sports", "Outdoors", "Gaming", "Food", "Arts"].map(
              (cat) => (
                <Link key={cat} href={`/events?category=${cat}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md text-center transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-2"
                  >
                    <Badge
                      variant="secondary"
                      className="mb-2 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {cat}
                    </Badge>
                  </motion.div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Featured Events
              </h2>
              <p className="text-muted-foreground">
                Hand-picked events just for you
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex group">
              <Link href="/events">
                View All{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  {/* <Skeleton className="h-48 w-full rounded-2xl" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" /> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularEvents.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Button
                        size="sm"
                        className="w-full rounded-full bg-white/90 text-black hover:bg-white"
                        asChild
                      >
                        <Link href={`/events/${event._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm mb-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </div>
                      <span className="font-bold text-lg text-primary">
                        {event.price > 0 ? `$${event.price}` : "Free"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-8 md:hidden text-center">
            <Button variant="outline" asChild className="w-full">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Host Spotlight */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src={TopHost}
                  alt="Host Spotlight"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
                Top Host
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-6 text-center md:text-left">
              <h2 className="text-3xl font-bold">Meet Brian Lee</h2>
              <p className="text-lg text-muted-foreground leading-relaxed italic">
                "I started hosting hiking events to meet new people in the city.
                Two years later, I've made best friends and explored every trail
                in the region. Hosting on AddaHub changed my life!"
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Badge variant="outline" className="px-3 py-1">
                  24 Events Hosted
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  4.9/5 Rating
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Hiking Enthusiast
                </Badge>
              </div>
              <Button asChild variant="default" className="mt-4">
                <Link href="/events?host=SarahJ">View Sarah's Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-primary/5 border-y border-primary/10">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary/10">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">
                10k+
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">
                500+
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Events Hosted
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground mt-1">Cities</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground mt-1">App Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-background dark:to-slate-900">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply dark:mix-blend-soft-light dark:opacity-10"></div>
        </div>
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Ready to Experience More?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Whether you are looking to join an event or host your own, AddaHub
              is the place to be. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/20"
                asChild
              >
                <Link href="/register">Get Started for Free</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-background">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-16 text-foreground">
            Stories from our community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I found my hiking group here. Now I never hike alone!",
                user: "Sarah J.",
              },
              {
                quote:
                  "The best way to meet people in a new city. Highly recommended.",
                user: "Mike T.",
              },
              {
                quote:
                  "Events are well organized and the people are genuinely friendly.",
                user: "Emily R.",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-indigo-100 dark:border-border"
              >
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed text-muted-foreground">
                  "{testimonial.quote}"
                </p>
                <p className="font-semibold text-primary">
                  - {testimonial.user}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I join an event?</AccordionTrigger>
              <AccordionContent>
                Simply browse our events page, select an event you're interested
                in, and click the "Join Event" button. You'll need to create an
                account first.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it free to use?</AccordionTrigger>
              <AccordionContent>
                Yes, browsing and joining many events is free. Some specific
                events may have a ticket price set by the organizer.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I host my own event?</AccordionTrigger>
              <AccordionContent>
                Absolutely! Once you register as a <strong>Host</strong>, you
                can access your dashboard and create events for others to join.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to find your next adventure?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of others who are connecting, exploring, and having
              fun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 h-14 px-8 text-lg"
              >
                <Link href="/register">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
