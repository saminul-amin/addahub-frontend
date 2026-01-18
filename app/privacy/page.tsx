"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-gray-600 space-y-4">
          <p>Last updated: January 2026</p>
          <h3>1. Information We Collect</h3>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, create an event, or communicate with us.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, including to process transactions, send you related
            information, and respond to your comments and questions.
          </p>

          <h3>3. Sharing of Information</h3>
          <p>
            We may share personal information with vendors, consultants, and
            other service providers who need access to such information to carry
            out work on our behalf.
          </p>

          <h3>4. Security</h3>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access, disclosure,
            alteration and destruction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
