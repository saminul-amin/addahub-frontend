"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Suspense } from "react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("eventId");

  return (
    <div className="text-center p-8">
      <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Payment Cancelled
      </h2>
      <p className="text-muted-foreground mb-8 text-lg">
        Your payment was not processed. No charges were made.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/events")}>
          Home
        </Button>
        {eventId && (
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push(`/events/${eventId}`)}
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <PaymentCancelContent />
        </Suspense>
      </Card>
    </div>
  );
}
