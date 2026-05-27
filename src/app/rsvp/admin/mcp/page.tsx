"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const MCP_URL = "https://brooker.family/api/rsvps/mcp";
const SSE_URL = "https://brooker.family/api/rsvps/sse";

const codexCliConfig = `[mcp_servers.brooker_rsvps]
url = "https://brooker.family/api/rsvps/mcp"

[mcp_servers.brooker_rsvps.headers]
# Generate the value below by running this in Terminal:
#   echo -n 'USER:PASS' | base64
# (USER/PASS are the admin login for brooker.family)
Authorization = "Basic BASE64_OF_USER_COLON_PASS"`;

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      className="rounded-full border border-[#B8A9C9]/40 bg-[#B8A9C9]/10 px-3 py-1 text-xs font-medium text-[#4A2040] transition hover:bg-[#B8A9C9]/20 dark:border-[#B8A9C9]/30 dark:bg-[#B8A9C9]/15 dark:text-[#D4C8E0] dark:hover:bg-[#B8A9C9]/25"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

function CodeBlock({ children, copyText }: { children: string; copyText?: string }) {
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl border border-[#2D5016]/15 bg-[#FDF8F0]/80 p-4 font-mono text-xs leading-relaxed text-[#2D5016] dark:border-[#FDF8F0]/15 dark:bg-[#0F1B11]/80 dark:text-[#E8DCC0] sm:text-sm">
        <code>{children}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton text={copyText ?? children} />
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  children,
  accent = "lavender",
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  accent?: "sage" | "lavender" | "blush" | "gold";
}) {
  const accentColors = {
    sage: "border-[#9CAF88]/25 bg-[#9CAF88]/5 dark:border-[#9CAF88]/15 dark:bg-[#9CAF88]/8",
    lavender:
      "border-[#B8A9C9]/25 bg-[#B8A9C9]/5 dark:border-[#B8A9C9]/15 dark:bg-[#B8A9C9]/8",
    blush:
      "border-[#F2D7D5]/45 bg-[#F2D7D5]/10 dark:border-[#D4A894]/20 dark:bg-[#D4A894]/8",
    gold: "border-[#D4A574]/25 bg-[#D4A574]/5 dark:border-[#D4A574]/15 dark:bg-[#D4A574]/8",
  };
  const badgeColors = {
    sage: "bg-[#9CAF88]/20 text-[#2D5016] dark:bg-[#9CAF88]/25 dark:text-[#C8D8B8]",
    lavender:
      "bg-[#B8A9C9]/25 text-[#4A2040] dark:bg-[#B8A9C9]/25 dark:text-[#D4C8E0]",
    blush:
      "bg-[#F2D7D5]/40 text-[#4A2040] dark:bg-[#D4A894]/25 dark:text-[#F0DDD2]",
    gold: "bg-[#D4A574]/25 text-[#6B4226] dark:bg-[#D4A574]/25 dark:text-[#E8C8A0]",
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border ${accentColors[accent]} p-5 sm:p-7`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${badgeColors[accent]}`}
        >
          {number}
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2D5016] dark:text-[#FDF8F0] sm:text-3xl">
          {title}
        </h2>
      </div>
      <div className="space-y-4 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[#2D5016]/80 dark:text-[#FDF8F0]/75 sm:text-base">
        {children}
      </div>
    </motion.section>
  );
}

export default function RsvpMcpInstallPage() {
  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-16 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mb-2 font-[family-name:var(--font-body)] text-xs font-medium tracking-widest text-[#7A5A8A] uppercase dark:text-[#D4C8E0] sm:text-sm">
            Admin tool
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#2D5016] dark:text-[#FDF8F0] sm:text-5xl">
            Connect RSVPs to ChatGPT
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#4A2040] dark:text-[#FDF8F0]/80 sm:text-base">
            Hook ChatGPT up to our guest list so you can ask it things like
            &quot;who hasn&apos;t replied yet?&quot;, &quot;how many guests are
            coming?&quot;, or &quot;add the Smiths as attending with 2 adults and
            a kid.&quot;
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl border border-[#B8A9C9]/30 bg-[#FDF8F0]/60 p-5 backdrop-blur-sm dark:border-[#B8A9C9]/25 dark:bg-[#162618]/70 sm:p-6"
        >
          <p className="mb-3 text-xs font-semibold tracking-widest text-[#7A5A8A]/90 uppercase dark:text-[#D4C8E0]/80">
            Server URL
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="rounded-lg bg-[#2D5016]/5 px-3 py-2 font-mono text-sm text-[#2D5016] dark:bg-[#FDF8F0]/8 dark:text-[#E8DCC0]">
              {MCP_URL}
            </code>
            <CopyButton text={MCP_URL} />
          </div>
          <p className="mt-4 text-sm text-[#2D5016]/75 dark:text-[#FDF8F0]/70">
            Sign-in uses the same admin username + password as this admin page.
            This is a separate connector from the family calendar — set it up on
            its own.
          </p>
        </motion.div>

        <div className="space-y-5">
          <Section number="A" title="ChatGPT (Web, Mac, iPhone)" accent="lavender">
            <p>
              Set this up once on <strong>chatgpt.com</strong> on a laptop and
              it&apos;ll sync to your phone automatically. Needs ChatGPT Plus,
              Pro, or Business.
            </p>
            <ol className="ml-5 list-decimal space-y-2">
              <li>
                On a laptop, go to{" "}
                <a
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-[#B8A9C9] decoration-2 underline-offset-2"
                >
                  chatgpt.com
                </a>{" "}
                and sign in.
              </li>
              <li>
                Click your profile (<strong>bottom-left</strong>) &rarr;{" "}
                <strong>Settings</strong>.
              </li>
              <li>
                Go to <strong>Connectors</strong> (or{" "}
                <strong>Apps &amp; Connectors</strong>) &rarr;{" "}
                <strong>Advanced</strong> and turn on{" "}
                <strong>Developer mode</strong>. Custom MCP apps are hidden
                behind this toggle.
              </li>
              <li>
                Back in <strong>Connectors</strong>, click{" "}
                <strong>Create</strong> &rarr; <strong>Create app</strong>{" "}
                (the option that appears once developer mode is on).
              </li>
              <li>
                Fill in:
                <ul className="mt-2 ml-5 list-disc space-y-1">
                  <li>
                    <strong>Name:</strong> Brooker RSVPs
                  </li>
                  <li>
                    <strong>Description:</strong> Wedding guest list — query &amp;
                    edit RSVPs, mailing lists
                  </li>
                  <li>
                    <strong>MCP Server URL:</strong>{" "}
                    <code className="rounded bg-[#2D5016]/5 px-1.5 py-0.5 font-mono text-xs dark:bg-[#FDF8F0]/8">
                      {MCP_URL}
                    </code>
                  </li>
                  <li>
                    <strong>Authentication:</strong> OAuth
                  </li>
                </ul>
              </li>
              <li>
                Save &rarr; <strong>Connect</strong>. A browser tab pops up
                asking you to sign in with the admin user/pass &rarr; approve.
              </li>
              <li>
                On <strong>iPhone</strong>: open the ChatGPT app, start a new
                chat, tap the <strong>+</strong> / &quot;Tools&quot; button next
                to the message box, and toggle on <strong>Brooker RSVPs</strong>.
                (You may need to enable developer mode in the iPhone app&apos;s
                Settings too.)
              </li>
              <li>
                Try it:{" "}
                <em>&quot;How many guests have RSVP&apos;d yes so far?&quot;</em>
              </li>
            </ol>
          </Section>

          <Section number="?" title="What it can do" accent="blush">
            <p>
              The AI gets one tool, <strong>rsvp_exec</strong>, that runs a small
              JS snippet against the guest list. The snippet sees an{" "}
              <code>rsvp</code> object with methods for RSVPs (list, get, create,
              update, delete, stats) and mailing lists — so it can filter, count,
              and batch in a single call instead of bouncing back and forth.
            </p>
            <p>Some things you can ask:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <em>&quot;Who&apos;s coming, and what&apos;s the head count?&quot;</em>
              </li>
              <li>
                <em>&quot;List everyone bringing a potluck dish.&quot;</em>
              </li>
              <li>
                <em>
                  &quot;Add the Smiths — attending, 2 adults, 1 kid,
                  smith@example.com.&quot;
                </em>
              </li>
              <li>
                <em>
                  &quot;Make a thank-you mailing list of everyone who&apos;s
                  attending.&quot;
                </em>
              </li>
              <li>
                <em>&quot;Any dietary restrictions I should flag to the caterer?&quot;</em>
              </li>
            </ul>
            <p className="rounded-lg bg-[#D4A894]/10 px-3 py-2 text-xs text-[#6B4226] dark:bg-[#D4A894]/10 dark:text-[#E8C8A0]">
              ⚠️ This tool can <strong>edit and delete</strong> real RSVPs. It
              changes the same data you see in the{" "}
              <Link
                href="/rsvp/admin"
                className="underline decoration-[#D4A574] decoration-2 underline-offset-2"
              >
                admin view
              </Link>
              . Double-check before asking it to delete anything.
            </p>
          </Section>

          <Section number="B" title="Codex CLI (Terminal on Mac)" accent="sage">
            <p>
              If you use the OpenAI Codex CLI, it reads MCP servers from{" "}
              <code className="rounded bg-[#2D5016]/5 px-1.5 py-0.5 font-mono text-xs dark:bg-[#FDF8F0]/8">
                ~/.codex/config.toml
              </code>
              . Add this block:
            </p>
            <CodeBlock>{codexCliConfig}</CodeBlock>
            <p>
              Generate the Basic auth value in Terminal with{" "}
              <code className="rounded bg-[#2D5016]/5 px-1.5 py-0.5 font-mono text-xs dark:bg-[#FDF8F0]/8">
                echo -n &apos;USER:PASS&apos; | base64
              </code>{" "}
              (USER/PASS = the admin login), then paste the output after{" "}
              <code>Basic </code>.
            </p>
            <p className="text-xs text-[#2D5016]/60 dark:text-[#FDF8F0]/55">
              SSE fallback URL if an app asks:{" "}
              <code className="font-mono">{SSE_URL}</code>
            </p>
          </Section>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/rsvp/admin"
            className="inline-flex items-center gap-2 rounded-full border border-[#B8A9C9]/40 bg-[#B8A9C9]/10 px-5 py-2 text-sm font-medium text-[#4A2040] transition hover:bg-[#B8A9C9]/20 dark:border-[#B8A9C9]/30 dark:bg-[#B8A9C9]/15 dark:text-[#D4C8E0]"
          >
            &larr; Back to RSVP admin
          </Link>
        </div>
      </div>
    </div>
  );
}
