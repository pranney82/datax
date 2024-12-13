import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <section className="bg-zinc-950 text-slate-50 py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <Image
                    src="/assets/logos/7.png"
                    alt="logo"
                    width={240}
                    height={120}
                    className="h-11 w-auto"
                  />
                </span>
                <p className="mt-6 text-sm text-slate-400">
                  Data made easy.
                </p>
                <div className="mt-6">
                  <Link href="#">
                    <Image
                      src="/assets/logos/jobtread-logo-rgb-ow.png"
                      alt="JobTread Affiliate"
                      width={240}
                      height={120}
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              <div>
                <h3 className="mb-6 font-bold">Product</h3>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li className="font-medium hover:text-primary">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="/#dashboard">Dashboard</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="/#toolbox">Toolbox</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="/#library">Library</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="#">Test Drive</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="/pricing">Pricing</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-6 font-bold">Company</h3>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li className="font-medium hover:text-primary">
                    <Link href="/about">About</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="#">Roadmap</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-6 font-bold">Free Resources</h3>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li className="font-medium hover:text-primary">
                    <Link href="#">Library</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="#">Resources</Link>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <Link href="#">Summary Dashboard</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t border-slate-800 pt-8 text-center text-sm font-medium text-slate-400 lg:flex-row lg:items-center lg:text-left">
            <p>© 2024 A ContractorCTO Company.</p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              <li className="hover:text-primary">
                <Link href="#">Terms and Conditions</Link>
              </li>
              <li className="hover:text-primary">
                <Link href="#">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
  