"use client"

import {
  Menu,
  X,
  Zap,
  Home,
  Car,
  UserPen,
  BookOpen,
  Map,
  Heart,
  Cog,
  Code2,
  Users,
  BookText,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button, buttonVariants } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { AuthDialog } from "@/components/home/signup1"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/lib/firebase"

const iconMap = {
  Code2: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <Code2 className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
    </div>
  ),
  Users: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <Users className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
    </div>
  ),
  BookText: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <BookText className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
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
  Cog: (
    <div className="p-3 rounded-full bg-[#ffd400]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
      <Cog className="size-8 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
    </div>
  ),
  ZapSmall: <Zap className="size-5 shrink-0 text-[#ffd400]" />,
  Home: <Home className="size-5 shrink-0" />,
  Heart: <Heart className="size-5 shrink-0" />,
  Car: <Car className="size-5 shrink-0" />,
  UserPen: <UserPen className="size-5 shrink-0" />,
  Video: <Video className="size-5 shrink-0" />,
}

const Navbar1 = () => {
  const { user, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("signup")
  const router = useRouter()

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById("mobile-menu")
      const menuButton = document.getElementById("menu-button")
      if (
        mobileMenu &&
        !mobileMenu.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <section className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex justify-center">
          <div className="flex items-center gap-6 justify-between w-full max-w-7xl">
            <div className="flex items-center gap-2">
              <Link href="https://winyourdata.com">
                <Image src="/assets/logos/5.png" width={144} height={96} alt="logo" className="w-auto h-11" />
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                className={cn(
                  "text-gray-800 hover:text-ffd400 transition-colors duration-200 relative text-lg",
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: "ghost" }),
                  'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffd400] after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left',
                )}
                href="/"
              >
                <span>Home</span>
              </Link>
              <NavigationMenu className="text-lg">
                <NavigationMenuList>
                  <NavigationMenuItem className="text-gray-800">
                    <NavigationMenuTrigger className="hover:text-ffd400 transition-colors duration-200 relative text-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffd400] after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                      {iconMap.ZapSmall}
                      <span className="ml-2">Solutions</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 bg-white rounded-xl shadow-lg">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/datax"
                              className={cn(
                                "flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#ffd400]/10 focus:bg-[#ffd400]/10 group",
                              )}
                            >
                              {iconMap.Code2}
                              <div className="transition-transform duration-300 transform group-hover:translate-x-1">
                                <div className="text-base font-semibold text-black group-hover:text-[#ffd400] transition-colors duration-200">
                                  DATAx Software
                                </div>
                                <p className="text-sm leading-snug text-gray-600 group-hover:text-black transition-colors duration-200 mt-1">
                                  Already built automations, just turn on
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/cto"
                              className={cn(
                                "flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#ffd400]/10 focus:bg-[#ffd400]/10 group",
                              )}
                            >
                              {iconMap.Users}
                              <div className="transition-transform duration-300 transform group-hover:translate-x-1">
                                <div className="text-base font-semibold text-black group-hover:text-[#ffd400] transition-colors duration-200">
                                  CTO Consulting
                                </div>
                                <p className="text-sm leading-snug text-gray-600 group-hover:text-black transition-colors duration-200 mt-1">
                                  Custom automations, monthly CTO services
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/courses"
                              className={cn(
                                "flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#ffd400]/10 focus:bg-[#ffd400]/10 group",
                              )}
                            >
                              {iconMap.BookText}
                              <div className="transition-transform duration-300 transform group-hover:translate-x-1">
                                <div className="text-base font-semibold text-black group-hover:text-[#ffd400] transition-colors duration-200">
                                  Automation Courses
                                </div>
                                <p className="text-sm leading-snug text-gray-600 group-hover:text-black transition-colors duration-200 mt-1">
                                  Guided automation building - DIY
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
                  "text-gray-800 hover:text-ffd400 transition-colors duration-200 relative text-lg",
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: "ghost" }),
                  'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffd400] after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left',
                )}
                href="/about"
              >
                <span>About</span>
              </Link>
              <Link
                className={cn(
                  "text-gray-800 hover:text-ffd400 transition-colors duration-200 relative text-lg",
                  navigationMenuTriggerStyle,
                  buttonVariants({ variant: "ghost" }),
                  'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffd400] after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left',
                )}
                href="/hello"
              >
                <span>Contact</span>
              </Link>
            </div>
            <div className="flex gap-1">
              {loading ? (
                <div className="flex gap-1">
                  <div className="w-5 h-1 bg-muted animate-pulse rounded-md"></div>
                  <div className="w-10 h-1 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : (
                <>
                  <Link href="/video">
                    <Button
                      className="bg-black hover:bg-black text-white hover:text-white hover:scale-102 font-bold transition-transform duration-200"
                    >
                      <Video className="size-5 text-[#ffd400]" />
                      <span className="ml-2">Video</span>
                    </Button>
                  </Link>
                  {user ? (
                    <Button
                      className="bg-[#ffd400] text-black hover:bg-[#ffd400]/90"
                      onClick={() => router.push("/x")}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <Link href="/sign-up">
                      <Button
                        className="bg-[#FFD400] text-black hover:bg-[#ffd400]/90 font-bold"
                      >
                        Sign Up
                        <Zap className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (user) {
                        auth.signOut().then(() => {
                          router.push("/")
                        })
                      } else {
                        setAuthType("login")
                        setShowAuthDialog(true)
                      }
                    }}
                  >
                    {user ? "Sign Out" : "Sign In"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="https://winyourdata.com">
                <Image src="/assets/logos/5.png" width={120} height={80} alt="logo" className="w-auto h-12" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" id="menu-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>
              {loading ? (
                <div className="flex gap-1">
                  <div className="w-5 h-1 bg-muted animate-pulse rounded-md"></div>
                  <div className="w-10 h-1 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : user ? (
                <Button
                  className="bg-[#FFD400] text-black font-bold py-2 px-4 rounded-md text-sm"
                  onClick={() => router.push("/x")}
                >
                  Dashboard
                </Button>
              ) : (
                <Link href="/sign-up">
                  <Button
                    className="bg-[#FFD400] text-black font-bold py-2 px-4 rounded-md text-sm flex items-center"
                  >
                    <span>Sign Up</span>
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="mobile-menu"
                className="absolute right-0 left-0 top-[calc(100%+0.5rem)] bg-white border rounded-lg shadow-lg p-4 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="flex items-center text-base font-medium text-gray-800 hover:text-[#ffd400] transition-colors duration-200 text-lg"
                  >
                    {iconMap.Home}
                    <span className="ml-2">Home</span>
                  </Link>
                  <Link
                    href="/datax"
                    className="flex items-center text-base font-medium text-gray-800 hover:text-[#ffd400] transition-colors duration-200"
                  >
                    <div className="p-2 rounded-full bg-[#A9A9A9]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                      <Code2 className="size-6 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
                    </div>
                    <span className="ml-2">DATAx Software</span>
                  </Link>
                  <Link
                    href="/cto"
                    className="flex items-center text-base font-medium text-gray-800 hover:text-[#ffd400] transition-colors duration-200"
                  >
                    <div className="p-2 rounded-full bg-[#A9A9A9]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                      <Users className="size-6 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
                    </div>
                    <span className="ml-2">CTO Consulting</span>
                  </Link>
                  <Link
                    href="/courses"
                    className="flex items-center text-base font-medium text-gray-800 hover:text-[#ffd400] transition-colors duration-200"
                  >
                    <div className="p-2 rounded-full bg-[#A9A9A9]/10 group-hover:bg-[#ffd400] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                      <BookText className="size-6 text-[#ffd400] group-hover:text-black transition-colors duration-300" />
                    </div>
                    <span className="ml-2">Automation Courses</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center text-base font-medium text-gray-800 hover:text-[#ffd400] transition-colors duration-200 text-lg"
                  >
                    {iconMap.Heart}
                    <span className="ml-2">About</span>
                  </Link>
                  <Link
                    href="/video"
                    className="flex items-center text-base font-medium text-gray-800 hover:text-[#ffd400] transition-colors duration-200 text-lg"
                  >
                    {iconMap.Video}
                    <span className="ml-2">Video</span>
                  </Link>
                  <Link
                    href="/hello"
                    className="flex items-center text-base font-medium text-gray-800 hover:text-[#ffd400] transition-colors duration-200 text-lg"
                  >
                    {iconMap.UserPen}
                    <span className="ml-2">Contact</span>
                  </Link>
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        if (user) {
                          auth.signOut().then(() => {
                            router.push("/")
                          })
                        } else {
                          setAuthType("login")
                          setShowAuthDialog(true)
                        }
                      }}
                    >
                      {user ? "Sign Out" : "Sign In"}
                    </Button>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultView={authType}
        redirectPath="/x"
      />
    </section>
  )
}

export default Navbar1

