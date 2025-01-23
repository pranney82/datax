import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import CoursesSuccess from "@/components/home/courses-success";

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <CoursesSuccess />
      <Footer />
    </div>
  );
}
