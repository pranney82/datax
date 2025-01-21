import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import Courses from "@/components/home/courses";

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <Courses />
      <Footer />
    </div>
  );
}
