import Terms from "@/components/home/terms";
import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <Terms />
      <Footer />
    </div>
  );
}
