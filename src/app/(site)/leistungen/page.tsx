import { redirect } from "next/navigation";

/** Legacy route — Service nav now points to /service */
export default function LeistungenPage() {
  redirect("/service");
}
