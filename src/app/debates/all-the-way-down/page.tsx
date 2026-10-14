import type { Metadata } from "next";
import Atlas from "@/components/atlas/Atlas";

export const metadata: Metadata = {
  title: "All the Way Down — five objections to God, argued all the way down",
  description:
    "An interactive disputation: five objections to the God of Christian theism, the strongest classical replies, and the replies to those — mapped as a living argument tree you can explore, judge, and trace through 2,500 years of philosophy.",
  openGraph: {
    title: "All the Way Down",
    description: "Five objections to God, the strongest replies, and the replies to those — an interactive disputation.",
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
              The interactive map — where you can rule on each move and watch the argument respond — needs JavaScript.{" "}
              <a href="/debates/all-the-way-down/outline">Read the whole disputation as a plain outline →</a>
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
