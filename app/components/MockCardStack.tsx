"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface MockCardStackProps {
  items?: any[];
}

export const MockCardStack = ({ items = [] }: MockCardStackProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {items.map((card, i) => {
          if (i === index) {
            return (
              <motion.div
                key={card._id || i}
                layoutId={`card-${card._id || i}`}
                initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 10 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  zIndex: 10,
                  rotate: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  y: -100,
                  zIndex: 0,
                  rotate: -5,
                  filter: "blur(2px)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={`absolute w-[450px] p-6 rounded-3xl shadow-2xl glass-panel bg-white/90 dark:bg-card/90 border border-white/20 dark:border-border`}
                style={{ top: "15%" }}
              >
                <div className="h-64 mb-6 rounded-2xl overflow-hidden relative">
                  <img
                    src={
                      card.image ||
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000"
                    }
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 line-clamp-1 text-foreground">
                  {card.title}
                </h3>
                <div className="flex items-center gap-2 text-base text-muted-foreground mb-2">
                  <Calendar className="w-5 h-5 text-primary" />{" "}
                  {new Date(card.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" /> {card.location}
                </div>
              </motion.div>
            );
          }

          if (i === (index + 1) % items.length) {
            return (
              <motion.div
                key={card._id || i}
                layoutId={`card-${card._id || i}`}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{
                  scale: 0.95,
                  opacity: 0.5,
                  y: 40,
                  zIndex: 5,
                  rotate: 2,
                }}
                transition={{ duration: 0.6 }}
                className={`absolute w-[420px] p-6 rounded-3xl shadow-xl bg-white/50 dark:bg-card/50 border border-gray-100/50 dark:border-border/50`}
                style={{ top: "20%" }}
              >
                <div className="h-64 bg-muted rounded-2xl mb-6 animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-3/4 mb-3"></div>
              </motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
};
