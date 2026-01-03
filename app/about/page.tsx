'use client';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import TeamImage from '../../public/team.webp';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12 md:py-24">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col gap-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">About Us</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    We are on a mission to combat loneliness by connecting people through real-world activities and shared interests.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Our Story</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Started in 2024, EventsApp was born from a simple observation: it's hard to make friends as an adult. We noticed many people wanted to do things—hike, play board games, or try a new restaurant—but didn't have anyone to go with.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        We built this platform to bridge that gap. By focusing on *activities* first, we take the pressure off "networking" and let connections happen naturally while doing something you enjoy.
                    </p>
                </div>
                <div className="bg-indigo-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                    {/* Placeholder for an image */}
                    <img src={TeamImage} alt="Team Photo" />
                </div>
            </div>

            <div className="border-t pt-12 mt-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Join the Community</h2>
                    <p className="text-muted-foreground">
                        Whatever your interest, there is a group waiting for you.
                    </p>
                     <Button asChild size="lg" className="mt-4">
                        <Link href="/register">Join Now</Link>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
