"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-gray-600 space-y-4">
          <p>Last updated: January 2026</p>
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using AddaHub, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>

          <h3>2. Use License</h3>
          <p>
            Permission is granted to temporarily download one copy of the
            materials (information or software) on AddaHub's website for
            personal, non-commercial transitory viewing only.
          </p>

          <h3>3. User Conduct</h3>
          <p>
            You agree to use AddaHub only for lawful purposes. You are
            prohibited from posting or transmitting to or from this site any
            unlawful, threatening, libelous, defamatory, obscene, scandalous,
            inflammatory, or profane material.
          </p>

          <h3>4. Disclaimer</h3>
          <p>
            The materials on AddaHub's website are provided "as is". AddaHub
            makes no warranties, expressed or implied, and hereby disclaims and
            negates all other warranties, including without limitation, implied
            warranties or conditions of merchantability, fitness for a
            particular purpose, or non-infringement of intellectual property or
            other violation of rights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
