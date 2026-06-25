import { redirect } from "next/navigation";

// The vaccine debate now lives as a full "field map" under /debates.
// Keep this old URL working by redirecting to it.
export default function VaccineDebateRedirect() {
  redirect("/debates/vaccines.html");
}
