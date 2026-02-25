"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games", sparkle: true },
  { href: "/rsvp", label: "RSVP" },
  { href: "/story", label: "Our Story" },
  { href: "/details", label: "Details" },
];

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
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/85 shadow-[0_1px_20px_rgba(29,68,32,0.06)] backdrop-blur-xl"
          : "bg-cream/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-[family-name:var(--font-cormorant-garant)] text-2xl font-bold tracking-wide text-forest transition-colors group-hover:text-soft-gold sm:text-3xl">
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
                      ? "rounded-full bg-soft-gold/10 text-soft-gold-dark hover:bg-soft-gold/20"
                      : isActive
                        ? "text-forest"
                        : "text-forest/60 hover:text-forest"
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
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <motion.span
              animate={
                isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
              }
              className="block h-[2.5px] w-6 rounded-full bg-forest"
            />
            <motion.span
              animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="block h-[2.5px] w-6 rounded-full bg-forest"
            />
            <motion.span
              animate={
                isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="block h-[2.5px] w-6 rounded-full bg-forest"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Soft overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-forest/15 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in panel from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-40 h-full w-72 bg-cream/97 shadow-[-8px_0_30px_rgba(29,68,32,0.08)] backdrop-blur-xl md:hidden"
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
                          className={`block rounded-xl px-4 py-3 text-lg font-medium transition-all ${
                            link.sparkle
                              ? "bg-soft-gold/10 text-soft-gold-dark"
                              : isActive
                                ? "bg-sage/15 text-forest"
                                : "text-forest/70 hover:bg-sage/10 hover:text-forest"
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

                <div className="mt-auto text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-[family-name:var(--font-cormorant-garant)] text-lg text-soft-gold/60"
                  >
                    June 27, 2026
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
