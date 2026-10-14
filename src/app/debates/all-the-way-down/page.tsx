import type { Metadata } from "next";
import Atlas from "@/components/atlas/Atlas";

export const metadata: Metadata = {
  title: "All the Way Down · Five objections to the Christian God",
  description:
    "Five objections to the Christian God and the Christian replies, argued back and forth for up to seven rounds, with quotations from 2,500 years of scripture and philosophy. Mark each move Holds or Fails and see where you stand.",
  openGraph: {
    title: "All the Way Down",
    description: "Five objections to the Christian God, and what his defenders say back. Mark each move Holds or Fails and see where you stand.",
    type: "article",
  },
};

/* The content is imported by the client component itself, so it ships once as
   a cacheable JS chunk instead of being serialized into every page's payload.
   Readers without JavaScript (and search engines) get the whole disputation as
   a static outline at ./outline. */
export default function AllTheWayDownPage() {
  return (
    <>
      <noscript>
        <style>{".atw-app{display:none}"}</style>
        <div className="atl ol-noscript">
          <div className="lib lib-outline">
            <p className="lib-notice ol-ns-note">
              The interactive map, where you mark each move Holds or Fails, needs JavaScript.{" "}
              <a href="/debates/all-the-way-down/outline">Read every move as a plain outline →</a>
            </p>
          </div>
        </div>
      </noscript>
      <div className="atw-app">
        <Atlas />
      </div>
    </>
  );
}
