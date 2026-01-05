'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Added for search
import { useState, useEffect } from 'react'; // Added for search state
import { api } from './lib/api';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Calendar, Users, Star, Search, MapPin, CheckCircle2, Search as SearchIcon } from "lucide-react"; // Renamed Search to prevent conflict or use directly
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function HomeClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [popularEvents, setPopularEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const response = await api.get('/events?limit=3');
        if (response.data.success) {
          setPopularEvents(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch popular events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularEvents();
  }, []);

  const handleSearch = () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (location) params.append('location', location); 
      router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            className="flex flex-col items-center space-y-8 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 variants={itemVariants} className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              Turn your interests into <br/>
              <span className="text-indigo-600">real-world connections</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="max-w-[700px] text-gray-500 md:text-xl leading-relaxed">
              Don't do it alone. Find companions for hiking, gaming, dining, and more. 
              Join a community of thousands making new friends every day at <strong>AddaHub</strong>.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-lg font-semibold shadow-xl shadow-indigo-200">
                <Link href="/events">Start Exploring <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg hover:bg-gray-50">
                <Link href="#how-it-works">How it Works</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-4 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center"
              >
                  <div className="relative flex-grow w-full">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        placeholder="Search events (e.g., Hiking, Chess, Jazz)" 
                        className="pl-10 h-12 border-gray-200 bg-gray-50/50 focus:bg-white transition-colors" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                  </div>
                  <div className="relative w-full md:w-48">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        placeholder="Location" 
                        className="pl-10 h-12 border-gray-200 bg-gray-50/50 focus:bg-white transition-colors" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                  </div>
                  <Button size="lg" onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700 h-12 w-full md:w-auto px-8">
                      Find Event
                  </Button>
              </motion.div>
          </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Explore Categories</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Discover activities that match your passion.</p>
            </div>
            
            <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
            >
             {[
                 { icon: Calendar, label: "Social", color: "bg-orange-100 text-orange-600" },
                 { icon: Users, label: "Community", color: "bg-blue-100 text-blue-600" },
                 { icon: Star, label: "Featured", color: "bg-yellow-100 text-yellow-600" },
                 { icon: CheckCircle2, label: "Sports", color: "bg-green-100 text-green-600" }
             ].map((item, idx) => (
                 <motion.div key={idx} variants={itemVariants} className="group cursor-pointer">
                     <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4 text-center group-hover:-translate-y-1">
                        <div className={`p-4 rounded-full ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900">{item.label}</h3>
                     </div>
                 </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

        <section className="py-20 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                 <div className="flex justify-between items-end mb-12">
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Popular Events</h2>
                        <p className="text-gray-500">Trending activities near you.</p>
                     </div>
                     <Link href="/events" className="text-indigo-600 font-semibold hover:text-indigo-700 hidden sm:inline-block">View all &rarr;</Link>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {loading ? (
                        <div className="col-span-3 text-center text-gray-500 py-12">Loading popular events...</div>
                     ) : popularEvents.length > 0 ? (
                        popularEvents.map((event) => (
                            <Link key={event._id} href={`/events/${event._id}`}>
                                <div className="group rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                                    <div className="h-48 bg-gray-100 relative">
                                        {/* You can add an image check here if event.image exists */}
                                        {event.image ? (
                                             <Image 
                                             src={event.image || '/placeholder-event.jpg'} 
                                             alt={event.title}
                                             fill
                                             className="object-cover transition-transform duration-300 group-hover:scale-105"
                                          />
                                        ) : (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                            Popular
                                        </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="text-sm text-indigo-600 font-medium mb-2">
                                            {new Date(event.date).toLocaleDateString()} • {event.time}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-1" /> {event.location}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                     ) : (
                        <div className="col-span-3 text-center text-gray-500 py-12">No events found.</div>
                     )}
                 </div>
            </div>
        </section>

      <section id="how-it-works" className="py-24 bg-gradient-to-b from-indigo-50/50 to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
              <div className="text-center mb-20">
                  <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-4 py-1.5 text-sm font-medium">Simple & Easy</Badge>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                      How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AddaHub</span> Works
                  </h2>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                      Connecting with new people shouldn't be complicated. We've made it as easy as 1-2-3.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  {[
                      {
                          icon: <Users className="w-10 h-10 text-white" />,
                          title: "Create a Profile",
                          desc: "Sign up in seconds. Showcase your hobbies, interests, and bio to helps others find you.",
                          color: "bg-blue-500"
                      },
                      {
                          icon: <Calendar className="w-10 h-10 text-white" />,
                          title: "Discover Events",
                          desc: "Browse through hundreds of local activities. Filter by interest, date, or location.",
                          color: "bg-indigo-500"
                      },
                      {
                          icon: <Star className="w-10 h-10 text-white" />,
                          title: "Join & Connect",
                          desc: "Join an event and meet like-minded people. Chat, make friends, and have fun!",
                          color: "bg-purple-500"
                      }
                  ].map((item, index) => (
                      <div key={index} className="relative group">
                          <div className="absolute inset-0 bg-white rounded-2xl shadow-xl transform transition-transform duration-300 group-hover:-translate-y-2"></div>
                          <div className="relative p-8 text-center">
                              <div className={`w-20 h-20 mx-auto ${item.color} rounded-2xl shadow-lg flex items-center justify-center transform rotate-3 transition-transform duration-300 group-hover:rotate-6 mb-8`}>
                                  {item.icon}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <section className="py-20 bg-indigo-900 text-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-16">Stories from our community</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { quote: "I found my hiking group here. Now I never hike alone!", user: "Sarah J." },
                    { quote: "The best way to meet people in a new city. Highly recommended.", user: "Mike T." },
                    { quote: "Events are well organized and the people are genuinely friendly.", user: "Emily R." }
                ].map((testimonial, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-indigo-800/50 p-8 rounded-2xl backdrop-blur-sm border border-indigo-700"
                    >
                        <div className="flex justify-center mb-4">
                            {[1,2,3,4,5].map((s) => <Star key={s} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                        </div>
                        <p className="text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                        <p className="font-semibold text-indigo-300">- {testimonial.user}</p>
                    </motion.div>
                ))}
            </div>
          </div>
      </section>

       <section className="py-20 bg-white">
           <div className="container px-4 md:px-6 mx-auto max-w-3xl">
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
                </div>
               <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I join an event?</AccordionTrigger>
                  <AccordionContent>
                    Simply browse our events page, select an event you're interested in, and click the "Join Event" button. You'll need to create an account first.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes, browsing and joining many events is free. Some specific events may have a ticket price set by the organizer.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I host my own event?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! Once you register as a <strong>Host</strong>, you can access your dashboard and create events for others to join.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
           </div>
       </section>

       <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container px-4 md:px-6 mx-auto text-center">
             <div className="max-w-3xl mx-auto space-y-8">
                 <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to find your next adventure?</h2>
                 <p className="text-gray-500 text-lg">Join thousands of others who are connecting, exploring, and having fun.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg">
                        <Link href="/register">Create Free Account</Link>
                    </Button>
                 </div>
             </div>
          </div>
       </section>
    </div>
  );
}
