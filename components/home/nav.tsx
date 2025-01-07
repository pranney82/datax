'use client';

import { Menu, X, Zap, Home, Info, Car, DollarSign, BarChart3, Wrench, BookOpen, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AuthDialog } from '@/components/home/signup1';

import { useAuth } from '@/lib/context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const iconMap = {
  BarChart3: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <BarChart3 className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
    </div>
  ),
  Wrench: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <Wrench className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
    </div>
  ),
  BookOpen: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <BookOpen className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
    </div>
  ),
  Map: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <Map className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
    </div>
  ),
  Zap: <Zap className="size-5 shrink-0 text-[#ffd400]" />,
  Home: <Home className="size-5 shrink-0" />,
  Info: <Info className="size-5 shrink-0" />,
  Car: <Car className="size-5 shrink-0" />,
  DollarSign: <DollarSign className="size-5 shrink-0" />,
};

const Navbar1 = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('signup');
  const router = useRouter();
  const [isHoveringSignUp, setIsHoveringSignUp] = useState(false);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-button');
      if (mobileMenu && !mobileMenu.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

    const handleSignOut = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

  return (
    <section className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Link href="https://winyourdata.com">
                <Image
                  src="/assets/logos/5.png"
                  width={96}
                  height={64}
                  alt="logo"
                  className="w-auto"
                />
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                className={cn(
                  'text-gray-800 hover:text-ffd400 transition-colors duration-200',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/"
              >
                <span>Home</span>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="text-gray-800">
                    <NavigationMenuTrigger className="hover:text-ffd400 transition-colors duration-200">
                      <Zap className="size-5 shrink-0 text-[#ffd400]" />
                      <span className="ml-2">Features</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 bg-white rounded-xl shadow-lg">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="https://www.winyourdata.com/#epic-features"
                              className={cn(
                                'flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#ffd400]/10 focus:bg-[#ffd400]/10 group'
                              )}
                            >
                              {iconMap.BarChart3}
                              <div className="transition-transform duration-300 transform group-hover:translate-x-1">
                                <div className="text-base font-semibold text-black group-hover:text-[#ffd400] transition-colors duration-200">
                                  Dashboard
                                </div>
                                <p className="text-sm leading-snug text-gray-600 group-hover:text-black transition-colors duration-200 mt-1">
                                  Visualize your JOBTREAD data
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>

                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="https://www.winyourdata.com/#epic-features"
                              className={cn(
                                'flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#ffd400]/10 focus:bg-[#ffd400]/10 group'
                              )}
                            >
                              {iconMap.Wrench}
                              <div className="transition-transform duration-300 transform group-hover:translate-x-1">
                                <div className="text-base font-semibold text-black group-hover:text-[#ffd400] transition-colors duration-200">
                                  Toolbox
                                </div>
                                <p className="text-sm leading-snug text-gray-600 group-hover:text-black transition-colors duration-200 mt-1">
                                  Access helpful tools and resources
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>

                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="https://www.winyourdata.com/#epic-features"
                              className={cn(
                                'flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#ffd400]/10 focus:bg-[#ffd400]/10 group'
                              )}
                            >
                              {iconMap.BookOpen}
                              <div className="transition-transform duration-300 transform group-hover:translate-x-1">
                                <div className="text-base font-semibold text-black group-hover:text-[#ffd400] transition-colors duration-200">
                                  Library
                                </div>
                                <p className="text-sm leading-snug text-gray-600 group-hover:text-black transition-colors duration-200 mt-1">
                                  Explore our extensive knowledge base
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>

                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/roadmap"
                              className={cn(
                                'flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#ffd400]/10 focus:bg-[#ffd400]/10 group'
                              )}
                            >
                              {iconMap.Map}
                              <div className="transition-transform duration-300 transform group-hover:translate-x-1">
                                <div className="text-base font-semibold text-black group-hover:text-[#ffd400] transition-colors duration-200">
                                  Roadmap
                                </div>
                                <p className="text-sm leading-snug text-gray-600 group-hover:text-black transition-colors duration-200 mt-1">
                                  See what&apos;s coming next
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>

                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/coverphoto"
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                            >
                              {iconMap.BookOpen}
                              <div>
                                <div className="text-sm font-semibold">
                                  Cover Photo Automation
                                </div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  Automatically generate cover photos for your jobs
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Link
                className={cn(
                  'text-gray-800 hover:text-ffd400 transition-colors duration-200',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/about"
              >
                <span>About</span>
              </Link>

              {/* TODO: link to pricing page when ready */}
              <Link
                className={cn(
                  'text-gray-800 hover:text-ffd400 transition-colors duration-200',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/#"
              >

                <span>Pricing</span>

              </Link>
            </div>
          </div>
          
            
          <div className="flex gap-2">
            {loading ? (
              <div className="flex gap-2">
                <div className="w-20 h-9 bg-muted animate-pulse rounded-md"></div>
                <div className="w-24 h-9 bg-muted animate-pulse rounded-md"></div>
              </div>
            ) : user ? (
              <>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
                <Button 
                  className="bg-[#ffd400] text-black hover:bg-[#ffd400]/90"
                  onClick={() => {
                    router.push('/x');
                  }}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAuthType('login');
                    setShowAuthDialog(true);
                  }}
                >
                  Log in
                </Button>
                <Button 
                  className="w-full sm:w-auto bg-[#FFD400] text-black font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black relative overflow-hidden group shadow-[0_0_15px_rgba(255,212,0,0.5)]"
                  onClick={() => {
                    setAuthType('signup');
                    setShowAuthDialog(true);
                  }}
                  onMouseEnter={() => setIsHoveringSignUp(true)}
                  onMouseLeave={() => setIsHoveringSignUp(false)}
                >
                  <span className="relative z-10 transition-colors duration-300">Try Free</span>
                  <Zap className={`ml-2 h-5 w-5 relative z-10 transition-all duration-300 ${isHoveringSignUp ? 'rotate-[360deg] scale-125' : ''}`} />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#FFD400] to-white"
                    initial={{ x: '100%' }}
                    animate={isHoveringSignUp ? { x: '0%' } : { x: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="https://winyourdata.com">
                <Image
                  src="/assets/logos/5.png"
                  width={96}
                  height={64}
                  alt="logo"
                  className="w-auto"
                />
              </Link>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              id="menu-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div 
              id="mobile-menu"
              className="absolute right-0 left-0 top-[calc(100%+0.5rem)] bg-white border rounded-lg shadow-lg p-4 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <nav className="flex flex-col gap-4">
                <Link href="/" className="flex items-center text-base font-medium text-gray-800 hover:text-ffd400 transition-colors duration-200">
                  <span>Home</span>
                </Link>
                <div className="space-y-2">
                  <div className="flex items-center text-base font-medium text-gray-800">
                    {iconMap.Zap}
                    <span className="ml-2">Features</span>
                  </div>
                  <div className="pl-4 space-y-2">
                    <Link href="/#dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ffd400] transition-colors duration-200">
                      {iconMap.BarChart3}
                      <span>Dashboard</span>
                    </Link>
                    <Link href="/#toolbox" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ffd400] transition-colors duration-200">
                      {iconMap.Wrench}
                      <span>Toolbox</span>
                    </Link>
                    <Link href="/#library" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ffd400] transition-colors duration-200">
                      {iconMap.BookOpen}
                      <span>Library</span>
                    </Link>
                    <Link href="/roadmap" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ffd400] transition-colors duration-200">
                      {iconMap.Map}
                      <span>Roadmap</span>
                    </Link>
                  </div>
                </div>
                <Link href="/about" className="flex items-center text-base font-medium text-gray-800 hover:text-ffd400 transition-colors duration-200">
                  <span>About</span>
                </Link>
                <Link href="/pricing" className="flex items-center text-base font-medium text-gray-800 hover:text-ffd400 transition-colors duration-200">
                  <span>Pricing</span>
                </Link>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setAuthType('login');
                      setShowAuthDialog(true);
                    }}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="w-full sm:w-auto bg-[#FFD400] text-black font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black relative overflow-hidden group shadow-[0_0_15px_rgba(255,212,0,0.5)]"
                    onClick={() => {
                      setAuthType('signup');
                      setShowAuthDialog(true);
                    }}
                    onMouseEnter={() => setIsHoveringSignUp(true)}
                    onMouseLeave={() => setIsHoveringSignUp(false)}
                  >
                    <span className="relative z-10 transition-colors duration-300">Sign up</span>
                    <Zap className={`ml-2 h-5 w-5 relative z-10 transition-all duration-300 ${isHoveringSignUp ? 'rotate-[360deg] scale-125' : ''}`} />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-[#FFD400] to-white"
                      initial={{ x: '100%' }}
                      animate={isHoveringSignUp ? { x: '0%' } : { x: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        defaultView={authType}
        redirectPath="/x"
      />
    </section>
  );
};

export default Navbar1;

