'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function ContactClient() {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
        toast.success("Message Sent!", {
            description: "We'll get back to you as soon as possible."
        });
        reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Get in Touch</h1>
                    <p className="mt-4 text-xl text-gray-600">We'd love to hear from you. Here's how you can reach us.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Email Us</CardTitle>
                                    <CardDescription>Our friendly team is here to help.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-indigo-600 font-medium">support@addahub.com</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Visit Us</CardTitle>
                                    <CardDescription>Come say hello at our office HQ.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Block: C, Section: 10<br />Mirpur, Dhaka</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Call Us</CardTitle>
                                    <CardDescription>Mon-Fri from 8am to 5pm.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">+880 1234 567890</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                                            <Input id="name" placeholder="John Doe" {...register('name', { required: true })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                                            <Input id="email" type="email" placeholder="john@example.com" {...register('email', { required: true })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject</label>
                                        <Input id="subject" placeholder="How can we help?" {...register('subject', { required: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                                        <textarea 
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="message" 
                                            placeholder="Tell us more..." 
                                            {...register('message', { required: true })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700">
                                        <Send className="w-4 h-4 mr-2" /> Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
