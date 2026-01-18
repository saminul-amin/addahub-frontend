"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const eventId = searchParams.get("eventId");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || !eventId) {
      setError("Invalid payment session details.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) throw new Error("Please login");
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        const res = await api.post("/payments/verify-payment", {
          sessionId,
          eventId,
          userId,
        });

        if (res.data.success) {
          setVerified(true);
        } else {
          setError("Payment verification failed.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId, eventId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Payment Verification Failed
        </h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button onClick={() => router.push(`/events/${eventId}`)}>
            Back to Event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Payment Successful!
      </h2>
      <p className="text-muted-foreground mb-8 text-lg">
        You have successfully joined the event. We are excited to see you there!
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/events")}>
          Find More Events
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => router.push(`/events/${eventId}`)}
        >
          View Event Details
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </Card>
    </div>
  );
}
