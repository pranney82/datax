import Footer from '@/components/home/footer';
import Navbar1 from '@/components/home/nav';
import CoursesSuccessTwo from '@/components/home/courses-success-two';

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      <Navbar1 />
      <CoursesSuccessTwo />
      <Footer />
    </div>
  );
}
