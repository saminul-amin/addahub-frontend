export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Cookies Policy
      </h1>
      <div className="space-y-6 text-muted-foreground">
        <p>Effective Date: January 1, 2026</p>
        <p>
          At AddaHub, we use cookies to improve your experience, analyze site
          traffic, and personalize content. This Cookies Policy explains what
          cookies are, how we use them, and your choices regarding cookies.
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            What Are Cookies?
          </h2>
          <p>
            Cookies are small text files that are stored on your device
            (computer, tablet, or mobile) when you visit a website. They allow
            the website to recognize your device and remember your preferences
            or actions over time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            How We Use Cookies
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> These are necessary for the
              website to function properly, such as enabling you to log in and
              access secure areas.
            </li>
            <li>
              <strong>Performance & Analytics Cookies:</strong> We use these to
              understand how visitors interact with our website, which helps us
              improve performance and user experience.
            </li>
            <li>
              <strong>Functional Cookies:</strong> These allow us to remember
              your choices (like language or region) to provide a more
              personalized experience.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Managing Your Cookies
          </h2>
          <p>
            Most web browsers automatically accept cookies, but you can usually
            modify your browser settings to decline cookies if you prefer.
            However, this may prevent you from taking full advantage of the
            website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact
            us at{" "}
            <a
              href="mailto:saminul.amin@gmail.com"
              className="text-primary hover:underline"
            >
              saminul.amin@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
