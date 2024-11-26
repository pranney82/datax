'use client';

import { LineChart, Menu, Settings2, Trees, Book, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button, buttonVariants } from '@/components/ui/button';

const iconMap = {
  LineChart: <LineChart className="size-5 shrink-0" />,
  Trees: <Trees className="size-5 shrink-0" />,
  Book: <Book className="size-5 shrink-0" />,
  Zap: <Zap className="size-5 shrink-0" />,
  Settings2: <Settings2 className="size-5 shrink-0" />,
};

const Navbar1 = () => {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                className="w-8"
                alt="JTDash Logo"
              />
              <span className="text-xl font-bold">JTDash</span>
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
                          {[
                            {
                              title: "Analytics",
                              description: "Track your performance metrics",
                              href: "/analytics",
                              icon: "LineChart"
                            },
                            {
                              title: "Sustainability",
                              description: "Monitor environmental impact",
                              href: "/sustainability",
                              icon: "Trees"
                            },
                            {
                              title: "Learning",
                              description: "Access educational resources",
                              href: "/learning",
                              icon: "Book"
                            }
                          ].map((item, idx) => (
                            <li key={idx}>
                              <a
                                className={cn(
                                  'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                )}
                                href={item.href}
                              >
                                {iconMap[item.icon as keyof typeof iconMap]}
                                <div>
                                  <div className="text-sm font-semibold">
                                    {item.title}
                                  </div>
                                  <p className="text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </a>
                            </li>
                          ))}
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
                href="/pricing"
              >
                Pricing
              </a>
              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: 'ghost' })
                )}
                href="/about"
              >
                About
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Sign In
            </Button>
            <Button>
              Get Started
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                className="w-8"
                alt="JTDash Logo"
              />
              <span className="text-xl font-bold">JTDash</span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <img
                        src="/logo.png"
                        className="w-8"
                        alt="JTDash Logo"
                      />
                      <span className="text-xl font-bold">JTDash</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-8 flex flex-col gap-4">
                  <a href="/" className="font-semibold">
                    Home
                  </a>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="features" className="border-b-0">
                      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                        Features
                      </AccordionTrigger>
                      <AccordionContent className="font-semibold">
                        {[
                          {
                            title: "Analytics",
                            description: "Track your performance metrics",
                            href: "/analytics",
                            icon: "LineChart"
                          },
                          {
                            title: "Sustainability",
                            description: "Monitor environmental impact",
                            href: "/sustainability",
                            icon: "Trees"
                          },
                          {
                            title: "Learning",
                            description: "Access educational resources",
                            href: "/learning",
                            icon: "Book"
                          }
                        ].map((item, idx) => (
                          <a
                            key={idx}
                            className={cn(
                              'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            )}
                            href={item.href}
                          >
                            {iconMap[item.icon as keyof typeof iconMap]}
                            <div>
                              <div className="text-sm font-semibold">
                                {item.title}
                              </div>
                              <p className="text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <a href="/pricing" className="font-semibold">
                    Pricing
                  </a>
                  <a href="/about" className="font-semibold">
                    About
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar1;
