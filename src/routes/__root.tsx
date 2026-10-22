import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FloatingActions, Footer, Header, Loader, RouteWipe } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { getSiteData } from "@/data/public-data";
import { FALLBACK_SITE_DATA, SITE_URL, type SiteData } from "@/data/site-data";

/** Structured data so Google understands who Fumati is, where, and what it does. */
function structuredData(d: SiteData) {
  const s = d.settings;
  const sameAs = [s.facebook, s.instagram, s.linkedin, s.youtube, s.tiktok].filter(Boolean);
  const org = {
    "@type": ["Organization", "GeneralContractor"],
    "@id": `${SITE_URL}/#organization`,
    name: s.company_name,
    legalName: s.legal_name,
    alternateName: ["Fumati Group", "Fumati Engineering"],
    slogan: s.tagline,
    url: SITE_URL,
    logo: `${SITE_URL}/fumati-logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description: s.seo_description,
    email: s.email,
    telephone: s.phone3 || s.phone1,
    ...(s.founded_year ? { foundingDate: s.founded_year } : {}),
    founder: { "@type": "Person", name: s.ceo_name.replace(/^Mr\.?\s+/, "") },
    address: {
      "@type": "PostalAddress",
      streetAddress: "1/5 Sherwood Crescent, Waterfalls",
      addressLocality: "Harare",
      addressRegion: "Harare",
      addressCountry: "ZW",
    },
    geo: { "@type": "GeoCoordinates", latitude: -17.8735, longitude: 31.0353 },
    areaServed: { "@type": "Country", name: "Zimbabwe" },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
    award: d.collections.awards.map((a) => [a.title, a.organisation].filter(Boolean).join(" — ")),
    knowsAbout: [
      "Structural engineering",
      "Mechanical engineering",
      "Steel fabrication",
      "Welding",
      "Plant fitting",
      "Roof trusses",
      "Steel structures",
      "Gates and metalwork",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering services",
      itemListElement: d.collections.services.map((x) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: x.title,
          description: x.short,
          areaServed: "Zimbabwe",
        },
      })),
    },
    sameAs,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: s.company_name,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-ZW",
      },
    ],
  };
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-900 blueprint px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-8xl font-extrabold text-red-600">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-primary-foreground">
          This beam isn't here.
        </h1>
        <p className="mt-3 text-primary-foreground/70">
          The page you're looking for was never erected, or has been moved.
        </p>
        <Link to="/" className="btn btn-red mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-green"
          >
            Try again
          </button>
          <a href="/" className="btn btn-outline-green">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // One read of everything the owner edits, shared by every page through useSiteData().
  loader: () => getSiteData(),
  // Reuse it across in-app navigation; a full page load always fetches fresh data.
  staleTime: 5 * 60 * 1000,
  head: ({ loaderData }) => {
    const d = loaderData ?? FALLBACK_SITE_DATA;
    const s = d.settings;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { title: s.seo_title },
        { name: "description", content: s.seo_description },
        { name: "keywords", content: s.seo_keywords },
        { name: "author", content: s.company_name },
        { name: "theme-color", content: "#053321" },
        { name: "geo.region", content: "ZW-HA" },
        { name: "geo.placename", content: "Harare" },
        { property: "og:site_name", content: s.company_name },
        { property: "og:locale", content: "en_ZW" },
        { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(s.google_verification
          ? [{ name: "google-site-verification", content: s.google_verification }]
          : []),
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:ital,wght@0,700;0,800;1,800&display=swap",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        { rel: "icon", href: "/favicon.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        {
          rel: "preload",
          as: "image",
          href: d.collections.hero_slides[0]?.image ?? "/images/steel-frame-structure-harare.webp",
        },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData(d)) }],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZW">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        // The dashboard has its own shell; no public header, loader or WhatsApp button.
        <Outlet />
      ) : (
        <>
          <Loader />
          <RouteWipe />
          <Header />
          <main>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <Footer />
          <FloatingActions />
        </>
      )}
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
