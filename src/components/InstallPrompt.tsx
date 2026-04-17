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

function isIOSSafari(): boolean {
  if (!isIOS()) return false;
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Safari has "Safari" and doesn't have CriOS/FxiOS/EdgiOS/OPiOS/GSA
  const isSafari = /Safari/.test(ua);
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|GSA|YaBrowser|DuckDuckGo|Brave/.test(
    ua
  );
  return isSafari && !isOtherBrowser;
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
  const [iosInSafari, setIosInSafari] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
      setIosInSafari(isIOSSafari());
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

  const isIosFlow = showIosHint && !deferredPrompt;
  const needsSafari = isIosFlow && !iosInSafari;

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
          ) : needsSafari ? (
            <p className="mt-0.5 text-sm text-[#5C7A4A] dark:text-[#E8C8B8]/80">
              Open <span className="font-semibold">brooker.family</span> in{" "}
              <span className="font-semibold">Safari</span> to install.
              Chrome/Firefox on iOS can&rsquo;t add to Home Screen.
            </p>
          ) : expanded ? (
            <div className="mt-1 space-y-2 text-sm text-[#5C7A4A] dark:text-[#E8C8B8]/90">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1D4420] text-xs font-bold text-[#C49A3C]">
                  1
                </span>
                <span>
                  Tap the{" "}
                  <span
                    aria-label="Share icon"
                    className="inline-flex items-center gap-1 rounded bg-[#5C7A4A]/15 px-1.5 py-0.5 align-middle text-[#1D4420] dark:text-[#C49A3C]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M10.5 2.75a.75.75 0 0 0-1 0L6.73 5.22a.75.75 0 1 0 1.04 1.08L9.25 4.8v8.45a.75.75 0 0 0 1.5 0V4.8l1.48 1.5a.75.75 0 1 0 1.04-1.08l-2.77-2.47Z" />
                      <path d="M4 10.75A.75.75 0 0 0 3.25 10h-.5A2.75 2.75 0 0 0 0 12.75v2.5A2.75 2.75 0 0 0 2.75 18h14.5A2.75 2.75 0 0 0 20 15.25v-2.5A2.75 2.75 0 0 0 17.25 10h-.5a.75.75 0 0 0 0 1.5h.5c.69 0 1.25.56 1.25 1.25v2.5c0 .69-.56 1.25-1.25 1.25H2.75c-.69 0-1.25-.56-1.25-1.25v-2.5c0-.69.56-1.25 1.25-1.25h.5A.75.75 0 0 0 4 10.75Z" />
                    </svg>
                    Share
                  </span>{" "}
                  icon (bottom of Safari)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1D4420] text-xs font-bold text-[#C49A3C]">
                  2
                </span>
                <span>
                  Scroll and tap{" "}
                  <span className="font-semibold">Add to Home Screen</span>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1D4420] text-xs font-bold text-[#C49A3C]">
                  3
                </span>
                <span>
                  Tap <span className="font-semibold">Add</span> in the top
                  right
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-0.5 text-sm text-[#5C7A4A] dark:text-[#E8C8B8]/80">
              Add to your home screen for one-tap access.
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
            {isIosFlow && !needsSafari && !expanded && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="rounded-full bg-[#1D4420] px-3 py-1.5 text-sm font-medium text-[#FDF8F0] transition hover:bg-[#5C7A4A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C49A3C]"
              >
                Show me how
              </button>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full px-3 py-1.5 text-sm text-[#5C7A4A] transition hover:text-[#1D4420] dark:text-[#E8C8B8]/80 dark:hover:text-[#C49A3C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C49A3C]"
            >
              {expanded ? "Got it" : "Not now"}
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
