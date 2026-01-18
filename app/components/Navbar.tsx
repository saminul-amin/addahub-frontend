"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { api } from "@/app/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  ChevronDown,
  Calendar,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface UserPayload {
  userId: string;
  role: string;
  email: string;
}

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLogin = () => {
      const token = Cookies.get("accessToken");
      if (token) {
        setIsLoggedIn(true);
        try {
          const decoded = jwtDecode<UserPayload>(token);
          api
            .get(`/users/${decoded.userId}`)
            .then((res) => {
              if (res.data.success) {
                setUserData(res.data.data);
              }
            })
            .catch((e) => console.error(e));
        } catch (e) {
          console.error(e);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkLogin();

    const interval = setInterval(checkLogin, 1000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsLoggedIn(false);
    setUserData(null);
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "U";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Events", href: "/events" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80",
        scrolled
          ? "shadow-md py-2 border-b backdrop-blur-md"
          : "py-4 border-b border-transparent backdrop-blur-sm",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors">
              Adda
              <span className="group-hover:text-foreground text-primary">
                Hub
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute left-0 bottom-0 h-0.5 bg-primary transition-all",
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            ))}
            {isLoggedIn && (
              <>
                {userData?.role === "host" && (
                  <Link
                    href="/events/create"
                    className={cn(
                      "text-sm font-medium transition-colors relative group",
                      isActive("/events/create")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    Create Event
                    <span
                      className={cn(
                        "absolute left-0 bottom-0 h-0.5 bg-primary transition-all",
                        isActive("/events/create")
                          ? "w-full"
                          : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                )}
                <Link
                  href="/my-events"
                  className={cn(
                    "text-sm font-medium transition-colors relative group",
                    isActive("/my-events")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  My Events
                  <span
                    className={cn(
                      "absolute left-0 bottom-0 h-0.5 bg-primary transition-all",
                      isActive("/my-events")
                        ? "w-full"
                        : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full focus:ring-0"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <AvatarImage src="" alt={userData?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {userData ? getInitials(userData.name) : "..."}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.email || "..."}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-events")}
                    className="cursor-pointer"
                  >
                    <Calendar className="mr-2 h-4 w-4" /> My Events
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="px-3 pb-2 text-sm text-gray-500">
                      Signed in as <br />{" "}
                      <span className="font-medium text-gray-900">
                        {userData?.email}
                      </span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/dashboard")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/profile")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      Profile
                    </Link>

                    {userData?.role === "host" && (
                      <Link
                        href="/events/create"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block px-3 py-2 rounded-md text-base font-medium",
                          isActive("/events/create")
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent",
                        )}
                      >
                        Create Event
                      </Link>
                    )}

                    <Link
                      href="/my-events"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/my-events")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      My Events
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Button
                      asChild
                      className="w-full justify-center"
                      variant="outline"
                    >
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full justify-center bg-primary hover:bg-primary/90"
                    >
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
