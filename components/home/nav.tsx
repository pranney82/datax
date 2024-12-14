'use client';

import { LineChart, Menu, X, Trees, Book, Zap } from 'lucide-react';
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
const iconMap = {
  LineChart: <LineChart className="size-5 shrink-0" />,
  Trees: <Trees className="size-5 shrink-0" />,
  Book: <Book className="size-5 shrink-0" />,
  Zap: <Zap className="size-5 shrink-0" />,
};

const Navbar1 = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('signup');
  const router = useRouter();
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
              <Image
                src="/assets/logos/5.png"
                width={96}
                height={64}
                alt="logo"
                className="w-auto"
              />
            </div>
            <div className="flex items-center">
              <Link
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/"
              >
                Home
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="text-muted-foreground">
                    <NavigationMenuTrigger>
                      <span>Features</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-80 gap-3 p-3">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/#dashboard"
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                            >
                              {iconMap.LineChart}
                              <div>
                                <div className="text-sm font-semibold">
                                  Dashboard
                                </div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  The latest industry news, updates, and info
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>

                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/#toolbox"
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                            >
                              {iconMap.Trees}
                              <div>
                                <div className="text-sm font-semibold">
                                  Toolbox
                                </div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  Our mission is to innovate and empower the world
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>

                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/#library"
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                            >
                              {iconMap.Book}
                              <div>
                                <div className="text-sm font-semibold">
                                  Library
                                </div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  Browse job listing and discover our workspace
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
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/about"
              >
                About
              </Link>
              <Link
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="#"
              >
                Test Drive
              </Link>
              <Link
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/pricing"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            {user ? (
              <>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground"
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
                    console.log('login');
                  }}
                >
                  Log in
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground"
                  onClick={() => {
                    setAuthType('signup');
                    setShowAuthDialog(true);
                    console.log('signup');
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logos/5.png"
                width={96}
                height={64}
                alt="logo"
                className="w-auto"
              />
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
              className="absolute right-0 left-0 top-[calc(100%+0.5rem)] bg-background border rounded-lg shadow-lg p-4 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-base font-medium hover:text-primary">
                  Home
                </Link>
                <Link href="/#features" className="text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                  Features
                </Link>
                <Link href="/about" className="text-base font-medium hover:text-primary">
                  About
                </Link>
                <Link href="#" className="text-base font-medium hover:text-primary">
                  Test Drive
                </Link>
                <Link href="/pricing" className="text-base font-medium hover:text-primary">
                  Pricing
                </Link>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setAuthType('login');
                      setShowAuthDialog(true);
                      console.log('login');
                    }}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setAuthType('signup');
                      setShowAuthDialog(true);
                      console.log('signup');
                    }}
                  >
                    Sign up
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
