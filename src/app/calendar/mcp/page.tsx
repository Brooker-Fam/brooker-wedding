"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const MCP_URL = "https://brooker.family/api/mcp";
const SSE_URL = "https://brooker.family/api/sse";

const codexCliConfig = `[mcp_servers.brooker_calendar]
url = "https://brooker.family/api/mcp"

[mcp_servers.brooker_calendar.headers]
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
      className="rounded-full border border-[#9CAF88]/40 bg-[#9CAF88]/10 px-3 py-1 text-xs font-medium text-[#2D5016] transition hover:bg-[#9CAF88]/20 dark:border-[#9CAF88]/30 dark:bg-[#9CAF88]/15 dark:text-[#C8D8B8] dark:hover:bg-[#9CAF88]/25"
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
  accent = "sage",
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

export default function McpInstallPage() {
  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-16 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mb-2 font-[family-name:var(--font-body)] text-xs font-medium tracking-widest text-[#6B8F5B] uppercase dark:text-[#C0D4A8] sm:text-sm">
            For Brittany
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#2D5016] dark:text-[#FDF8F0] sm:text-5xl">
            Connect the Calendar to AI
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#4A2040] dark:text-[#FDF8F0]/80 sm:text-base">
            Hook ChatGPT or Codex up to our family calendar so you can ask it
            things like &quot;what does Emmett have this week?&quot; or
            &quot;add gymnastics for Sapphire on Thursday.&quot;
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl border border-[#D4A574]/30 bg-[#FDF8F0]/60 p-5 backdrop-blur-sm dark:border-[#D4A574]/25 dark:bg-[#162618]/70 sm:p-6"
        >
          <p className="mb-3 text-xs font-semibold tracking-widest text-[#6B4226]/80 uppercase dark:text-[#E8C8A0]/80">
            Server URL
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="rounded-lg bg-[#2D5016]/5 px-3 py-2 font-mono text-sm text-[#2D5016] dark:bg-[#FDF8F0]/8 dark:text-[#E8DCC0]">
              {MCP_URL}
            </code>
            <CopyButton text={MCP_URL} />
          </div>
          <p className="mt-4 text-sm text-[#2D5016]/75 dark:text-[#FDF8F0]/70">
            Sign-in uses the same admin username + password as the calendar
            admin page. Pick whichever option below matches the app you want
            to use.
          </p>
        </motion.div>

        <div className="space-y-5">
          <Section number="A" title="ChatGPT iPhone (and Mac / Web)" accent="lavender">
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
                    <strong>Name:</strong> Brooker Calendar
                  </li>
                  <li>
                    <strong>Description:</strong> Family calendar, tasks, kid
                    scoreboard
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
                Open the <strong>ChatGPT app on your iPhone</strong>, start a
                new chat, tap the <strong>+</strong> or &quot;Tools&quot;
                button next to the message box, and toggle on{" "}
                <strong>Brooker Calendar</strong>. (You may need to enable
                developer mode in the iPhone app&apos;s Settings too.)
              </li>
              <li>
                Try it:{" "}
                <em>&quot;What&apos;s on the family calendar this week?&quot;</em>
              </li>
            </ol>
          </Section>

          <Section number="B" title="Codex CLI (Terminal on Mac)" accent="sage">
            <p>
              The OpenAI Codex CLI reads MCP servers from{" "}
              <code className="rounded bg-[#2D5016]/5 px-1.5 py-0.5 font-mono text-xs dark:bg-[#FDF8F0]/8">
                ~/.codex/config.toml
              </code>
              . Open Terminal and add this block:
            </p>
            <CodeBlock>{codexCliConfig}</CodeBlock>
            <p>
              <strong>Generating the Basic auth value:</strong> in Terminal, run
            </p>
            <CodeBlock copyText="echo -n 'USER:PASS' | base64">
              {`echo -n 'USER:PASS' | base64`}
            </CodeBlock>
            <p>
              Replace <code>USER</code> and <code>PASS</code> with the admin
              login. Paste the output after <code>Basic </code> in the config.
              Restart <code>codex</code> and the calendar tools show up.
            </p>
          </Section>

          <Section number="C" title="Codex IDE / Codex Mac App" accent="gold">
            <p>
              In the Codex desktop app or VS Code extension, find{" "}
              <strong>Settings &rarr; MCP Servers &rarr; Add</strong> (same
              pattern as Claude Desktop) and fill in:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <strong>Name:</strong> brooker-calendar
              </li>
              <li>
                <strong>Type:</strong> HTTP / Streamable
              </li>
              <li>
                <strong>URL:</strong>{" "}
                <code className="rounded bg-[#2D5016]/5 px-1.5 py-0.5 font-mono text-xs dark:bg-[#FDF8F0]/8">
                  {MCP_URL}
                </code>
              </li>
              <li>
                <strong>Auth:</strong> use the OAuth flow if offered, or add a
                custom header{" "}
                <code className="rounded bg-[#2D5016]/5 px-1.5 py-0.5 font-mono text-xs dark:bg-[#FDF8F0]/8">
                  Authorization: Basic &lt;base64&gt;
                </code>{" "}
                (same value as Option B).
              </li>
            </ul>
            <p className="text-xs text-[#2D5016]/60 dark:text-[#FDF8F0]/55">
              SSE fallback URL if the app asks:{" "}
              <code className="font-mono">{SSE_URL}</code>
            </p>
          </Section>

          <Section number="?" title="What it can do" accent="blush">
            <p>
              The AI gets one tool, <strong>calendar_exec</strong>, that runs a
              small JS snippet against the calendar. The snippet sees a{" "}
              <code>calendar</code> object with methods for tasks, members,
              scoreboard, completions, and recurring series &mdash; so it can
              filter, batch, and chain in a single call instead of bouncing
              back and forth.
            </p>
            <p>Some things you can ask:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <em>&quot;What does Emmett have this week?&quot;</em>
              </li>
              <li>
                <em>
                  &quot;Add gymnastics for Sapphire every Thursday at
                  4pm.&quot;
                </em>
              </li>
              <li>
                <em>
                  &quot;Mark all of today&apos;s chores done for Sapphire.&quot;
                </em>
              </li>
              <li>
                <em>&quot;Who&apos;s winning the scoreboard this month?&quot;</em>
              </li>
            </ul>
            <p>
              Anything the AI creates is tagged <code>source=&quot;mcp&quot;</code>{" "}
              so you can spot it in the{" "}
              <Link
                href="/calendar/admin"
                className="underline decoration-[#D4A574] decoration-2 underline-offset-2"
              >
                admin view
              </Link>
              .
            </p>
          </Section>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 rounded-full border border-[#9CAF88]/40 bg-[#9CAF88]/10 px-5 py-2 text-sm font-medium text-[#2D5016] transition hover:bg-[#9CAF88]/20 dark:border-[#9CAF88]/30 dark:bg-[#9CAF88]/15 dark:text-[#C8D8B8]"
          >
            &larr; Back to calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
