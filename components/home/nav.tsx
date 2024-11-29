'use client';

import { LineChart, Menu, X, Trees, Book, Zap, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const iconMap = {
  LineChart: <LineChart className="size-5 shrink-0" />,
  Trees: <Trees className="size-5 shrink-0" />,
  Book: <Book className="size-5 shrink-0" />,
  Zap: <Zap className="size-5 shrink-0" />,
};

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <section className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                className="w-8"
                alt="logo"
              />
              <span className="text-xl font-bold">DATAx</span>  
            </div>
            <div className="flex items-center">
              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/"
              >
                Home
              </a>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="text-muted-foreground">
                    <NavigationMenuTrigger>
                      <span>Features</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-80 p-3">
                        <NavigationMenuLink>
                          <li>
                            <a
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                              href="#"
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
                            </a>
                          </li>
                          <li>
                            <a
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                              href="#"
                            >
                              {iconMap.Trees}
                              <div>
                                <div className="text-sm font-semibold">
                                  JT Features
                                </div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  Our mission is to innovate and empower the world
                                </p>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                              href="#"
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
                            </a>
                          </li>
                        </NavigationMenuLink>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="#"
              >
                Test Drive
              </a>
              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="#"
              >
                Pricing
              </a>
              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="#"
              >
                About
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Log in
            </Button>
            <Button>
              Sign up
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                className="w-8"
                alt="logo"
              />
              <span className="text-xl font-bold">DATAx</span>
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
                <a href="/" className="text-base font-medium hover:text-primary">
                  Home
                </a>
                <a href="#features" className="text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                  Features
                </a>
                <a href="#" className="text-base font-medium hover:text-primary">
                  Test Drive
                </a>
                <a href="#" className="text-base font-medium hover:text-primary">
                  Pricing
                </a>
                <a href="#" className="text-base font-medium hover:text-primary">
                  About
                </a>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                  <Button className="w-full">
                    Sign up
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Navbar1;
