import { redirect } from "next/navigation";

// The recap is the section landing page now; this keeps older links working.
export default function BackpackingRecapRedirect() {
  redirect("/backpacking-2026");
}
