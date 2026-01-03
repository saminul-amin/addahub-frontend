'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
             <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Help Center</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-600">Find answers to common questions and learn how to get the most out of AddaHub.</p>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I create an account?</AccordionTrigger>
                            <AccordionContent>
                                Click on the "Sign Up" button in the top right corner. Fill in your name, email, and password. You can choose to register as a "User" to join events or a "Host" to organize them.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>How do I create an event?</AccordionTrigger>
                            <AccordionContent>
                                If you are registered as a Host, log in and go to your Dashboard. Click on the "Create Event" button, fill in the details, and publish your event.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Is there a fee to join events?</AccordionTrigger>
                            <AccordionContent>
                                It depends on the event. Some events are free, while others may have a joining fee set by the host. The price is clearly displayed on the event card.
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-4">
                            <AccordionTrigger>How can I contact support?</AccordionTrigger>
                            <AccordionContent>
                                You can reach out to us via our <a href="/contact" className="text-indigo-600 underline">Contact Page</a> or email us directly at support@addahub.com.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
             </Card>
        </div>
    );
}
