import type { Metadata } from "next";
import Script from "next/script";
import CTA11 from "@/components/home/cta";
import About from "@/components/home/about";
import Footer from '@/components/home/footer';

export const metadata: Metadata = {
  title: "About DATAx - Your Trusted JOBTREAD Automation Partner",
  description: "Learn about DATAx's mission to revolutionize JOBTREAD automation. Discover our expertise in workflow optimization, system integration, and business process automation.",
  keywords: "about DATAx, JOBTREAD experts, automation specialists, business process optimization, workflow automation company, integration solutions provider",
  alternates: {
    canonical: "https://winyourdata.com/about"
  },
  openGraph: {
    title: "About DATAx - JOBTREAD Automation Experts",
    description: "Learn about DATAx's mission and expertise in JOBTREAD automation and integration solutions.",
    url: "https://winyourdata.com/about",
    images: [
      {
        url: "/assets/images/about.png",
        width: 1200,
        height: 630,
        alt: "DATAx Team and Expertise"
      }
    ]
  }
};
import Navbar1 from '@/components/home/nav';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Win Your DATAx",
            "url": "https://winyourdata.com",
            "logo": "https://winyourdata.com/assets/images/thumb.png",
            "description": "Specialized provider of JOBTREAD automation and integration solutions"
          })
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://winyourdata.com"
            }, {
              "@type": "ListItem",
              "position": 2,
              "name": "About",
              "item": "https://winyourdata.com/about"
            }]
          })
        }}
      />
      <Navbar1 />
      <About />
      <CTA11 />
      <Footer />
    </div>
  );
}
