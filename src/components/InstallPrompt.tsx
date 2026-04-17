"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = "brooker-install-prompt-dismissed";

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // iPad on iOS 13+ reports as Mac; check touch support as a hint
  const isIpadOS =
    /Mac/.test(ua) &&
    typeof document !== "undefined" &&
    "ontouchend" in document;
  return /iPad|iPhone|iPod/.test(ua) || isIpadOS;
}

function isMobileOrTablet(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return true;
  if (isIOS()) return true;
  // Generic tablet hint: coarse pointer + narrow viewport
  if (typeof window !== "undefined") {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 1024px)").matches;
    if (coarse && narrow) return true;
  }
  return false;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const navStandalone = (window.navigator as Navigator & { standalone?: boolean })
    .standalone;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navStandalone === true
  );
}

export default function InstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start hidden, unlock in effect

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't show if already installed as a PWA
    if (isStandalone()) return;

    // Only show on mobile / tablet — desktop "install" is pointless here
    if (!isMobileOrTablet()) return;

    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") {
        setDismissed(true);
        return;
      }
    } catch {
      // localStorage may throw in private mode - proceed anyway
    }

    setDismissed(false);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS has no beforeinstallprompt - show manual instructions
    if (isIOS()) {
      setShowIosHint(true);
    }

    const installedHandler = () => {
      setDeferredPrompt(null);
      setShowIosHint(false);
      setDismissed(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  // Only render on calendar routes
  if (!pathname || !pathname.startsWith("/calendar")) return null;
  if (dismissed) return null;
  if (!deferredPrompt && !showIosHint) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Install Brooker Family app"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-4"
    >
      <div className="soft-card pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl px-4 py-3 shadow-lg">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1D4420] text-[#C49A3C] font-semibold">
          B
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-[family-name:var(--font-cormorant-garamond)] text-lg leading-tight text-[#1D4420] dark:text-[#C49A3C]">
            Install Brooker Family
          </p>
          {deferredPrompt ? (
            <p className="mt-0.5 text-sm text-[#5C7A4A] dark:text-[#E8C8B8]/80">
              Add the calendar to your home screen for quick access.
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-[#5C7A4A] dark:text-[#E8C8B8]/80">
              Tap the Share icon in Safari, then{" "}
              <span className="font-semibold">Add to Home Screen</span>.
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstall}
                className="rounded-full bg-[#1D4420] px-3 py-1.5 text-sm font-medium text-[#FDF8F0] transition hover:bg-[#5C7A4A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C49A3C]"
              >
                Install
              </button>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full px-3 py-1.5 text-sm text-[#5C7A4A] transition hover:text-[#1D4420] dark:text-[#E8C8B8]/80 dark:hover:text-[#C49A3C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C49A3C]"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[#5C7A4A] transition hover:bg-[#5C7A4A]/10 hover:text-[#1D4420] dark:text-[#E8C8B8]/70 dark:hover:text-[#C49A3C]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
