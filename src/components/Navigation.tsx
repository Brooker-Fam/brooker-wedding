"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games", sparkle: true },
  { href: "/rsvp", label: "RSVP" },
  { href: "/details", label: "Details" },
];

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const options: Array<{ value: "light" | "system" | "dark"; label: string; icon: React.ReactNode }> = [
    {
      value: "light",
      label: "Light",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
    },
    {
      value: "system",
      label: "Auto",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      value: "dark",
      label: "Dark",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`flex items-center gap-0.5 rounded-full border border-sage/20 bg-sage/5 p-0.5 dark:border-cream/10 dark:bg-cream/5 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
            theme === opt.value
              ? "bg-forest/15 text-forest dark:bg-cream/15 dark:text-cream"
              : "text-forest/40 hover:text-forest/70 dark:text-cream/40 dark:hover:text-cream/70"
          }`}
          aria-label={`${opt.label} theme`}
          title={opt.label}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/85 shadow-[0_1px_20px_rgba(29,68,32,0.06)] backdrop-blur-xl dark:bg-[#0D1F0F]/90 dark:shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
            : "bg-cream/40 backdrop-blur-sm dark:bg-[#0D1F0F]/40"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-18">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-[family-name:var(--font-cormorant-garant)] text-2xl font-bold tracking-wide text-forest transition-colors group-hover:text-soft-gold dark:text-cream sm:text-3xl">
                M & B
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      link.sparkle
                        ? "rounded-full bg-soft-gold/10 text-soft-gold-dark hover:bg-soft-gold/20 dark:bg-soft-gold/15 dark:text-soft-gold-light"
                        : isActive
                          ? "text-forest dark:text-cream"
                          : "text-forest/60 hover:text-forest dark:text-cream/60 dark:hover:text-cream"
                    }`}
                  >
                    {link.sparkle && (
                      <span className="mr-1 text-xs">&#10024;</span>
                    )}
                    {link.label}
                    {isActive && !link.sparkle && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-soft-gold"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
              <div className="ml-2 border-l border-sage/20 pl-2 dark:border-cream/10">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-[70] flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg bg-forest/10 dark:bg-cream/10 md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <motion.span
                animate={
                  isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="block h-[2.5px] w-6 rounded-full bg-forest dark:bg-cream"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="block h-[2.5px] w-6 rounded-full bg-forest dark:bg-cream"
              />
              <motion.span
                animate={
                  isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="block h-[2.5px] w-6 rounded-full bg-forest dark:bg-cream"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - rendered outside nav to avoid backdrop-filter stacking context */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Soft overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-forest/15 backdrop-blur-sm dark:bg-black/40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in panel from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-[60] h-full w-72 bg-cream shadow-[-8px_0_30px_rgba(29,68,32,0.08)] dark:bg-[#0D1F0F] dark:shadow-[-8px_0_30px_rgba(0,0,0,0.3)] md:hidden"
            >
              <div className="flex h-full flex-col px-6 pt-24 pb-8">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;

                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                      >
                        <Link
                          href={link.href}
                          className={`block rounded-xl px-4 py-3.5 text-lg font-medium transition-all ${
                            link.sparkle
                              ? "bg-soft-gold/10 text-soft-gold-dark dark:bg-soft-gold/15 dark:text-soft-gold-light"
                              : isActive
                                ? "bg-sage/15 text-forest dark:bg-sage/20 dark:text-cream"
                                : "text-forest/80 hover:bg-sage/10 hover:text-forest dark:text-cream/80 dark:hover:bg-sage/15 dark:hover:text-cream"
                          }`}
                        >
                          {link.sparkle && (
                            <span className="mr-2 text-sm">&#10024;</span>
                          )}
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-auto space-y-4 text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex justify-center"
                  >
                    <ThemeToggle />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-[family-name:var(--font-cormorant-garant)] text-lg text-soft-gold/70"
                  >
                    June 27, 2026
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
