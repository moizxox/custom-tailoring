import { redirect } from "next/navigation";

/** SEO-friendly alias — catalogue lives at /shop. */
export default function KatalogRedirectPage() {
  redirect("/shop");
}
