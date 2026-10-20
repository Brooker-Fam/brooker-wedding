"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

// Maple's Log holds a newborn's health notes: no session replay or event
// capture there (error reports still go through so bugs can be fixed).
const isPrivatePath = (path: string) => path === "/maple" || path.startsWith("/maple/");

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!ph) return;
    if (isPrivatePath(pathname)) {
      if (ph.sessionRecordingStarted()) ph.stopSessionRecording();
      return;
    }
    const url = searchParams.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    ph.capture("$pageview", { $current_url: window.location.origin + url });
  }, [pathname, searchParams, ph]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    if (posthog.__loaded) return;

    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // handled manually for App Router
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: { password: true },
      },
      capture_exceptions: true,
      disable_session_recording: isPrivatePath(window.location.pathname),
      before_send: (event) => {
        if (!event || event.event === "$exception") return event;
        const url = event.properties?.$current_url;
        let path = window.location.pathname;
        try {
          if (typeof url === "string") path = new URL(url, window.location.origin).pathname;
        } catch {
          // keep the current path
        }
        return isPrivatePath(path) ? null : event;
      },
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug(false);
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
