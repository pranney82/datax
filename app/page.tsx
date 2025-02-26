import type { Metadata } from "next";
import CTA11 from "@/components/home/cta";
import Faq1 from "@/components/home/faq";
import Feature43 from "@/components/home/feature43";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Win Your DATAx - JOBTREAD Automation & Integration Solutions",
  description: "Transform your JOBTREAD experience with DATAx. Automate workflows, integrate systems, and boost productivity with our specialized automation tools and expert solutions.",
  keywords: "JOBTREAD automation, workflow automation, business integration, productivity tools, data automation, construction management",
  alternates: {
    canonical: "https://winyourdata.com"
  },
  openGraph: {
    title: "Win Your DATAx - JOBTREAD Automation Solutions",
    description: "Transform your JOBTREAD experience with DATAx. Expert automation and integration solutions for enhanced productivity.",
    images: [
      {
        url: "/assets/images/thumb.png",
        width: 1200,
        height: 630,
        alt: "DATAx JOBTREAD Automation Platform"
      }
    ]
  }
};
import Feature74 from "@/components/home/feature74";
import Footer from "@/components/home/footer";
import Hero1 from "@/components/home/hero1";
import Logos3 from "@/components/home/logos3";
import Navbar1 from "@/components/home/nav";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Win Your DATAx",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web-based",
            "description": "JOBTREAD automation and integration platform for enhanced business productivity",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            }
          })
        }}
      />
      <Navbar1 />
      <Hero1 />
      <Logos3 />
      <Feature43 />
      <Feature74 />
      <Faq1 />
      <CTA11 />
      <Footer />
    </div>
  );
}
