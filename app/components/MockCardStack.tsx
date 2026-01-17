"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

export const MockCardStack = () => {
    const cards = [
        {
            id: 1,
            title: "Sunrise Yoga & Meditation",
            date: "Tomorrow, 6:00 AM",
            location: "Central Park",
            image: "https://images.unsplash.com/photo-1552083855-551155c71a36?auto=format&fit=crop&q=80&w=500",
            color: "bg-orange-50",
        },
        {
            id: 2,
            title: "Tech Networking Night",
            date: "Fri, 7:00 PM",
            location: "Downtown Hub",
            image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=500",
            color: "bg-blue-50",
        },
        {
            id: 3,
            title: "Italian Cooking Class",
            date: "Sat, 11:00 AM",
            location: "Culinary Institute",
            image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=500",
            color: "bg-green-50",
        }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % cards.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
                {cards.map((card, i) => {
                    if (i === index) {
                        return (
                            <motion.div
                                key={card.id}
                                layoutId={`card-${card.id}`}
                                initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 10 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    y: 0,
                                    zIndex: 10,
                                    rotate: 0,
                                    filter: "blur(0px)"
                                }}
                                exit={{
                                    scale: 0.9,
                                    opacity: 0,
                                    y: -100,
                                    zIndex: 0,
                                    rotate: -5,
                                    filter: "blur(2px)"
                                }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className={`absolute w-80 p-4 rounded-2xl shadow-2xl glass-panel ${card.color} border border-white/20`}
                                style={{ top: '20%' }}
                            >
                                <div className="h-40 mb-4 rounded-xl overflow-hidden relative">
                                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Calendar className="w-4 h-4 text-primary" /> {card.date}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-primary" /> {card.location}
                                </div>
                            </motion.div>
                        );
                    }
                    // Render next card behind
                    if (i === (index + 1) % cards.length) {
                        return (
                            <motion.div
                                key={card.id}
                                layoutId={`card-${card.id}`}
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{
                                    scale: 0.9,
                                    opacity: 0.6,
                                    y: 30,
                                    zIndex: 5,
                                    rotate: 3
                                }}
                                transition={{ duration: 0.6 }}
                                className={`absolute w-80 p-4 rounded-2xl shadow-xl bg-white border border-gray-100/50`}
                                style={{ top: '25%' }}
                            >
                                <div className="h-40 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            </motion.div>
                        )
                    }
                    return null;
                })}
            </AnimatePresence>
        </div>
    );
};
