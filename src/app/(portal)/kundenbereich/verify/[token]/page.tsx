import { redirect } from "next/navigation";
import { verifyRegistrationToken } from "@/lib/crm/registration";
import { createPortalSession } from "@/lib/portal/session";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Mail bestätigen — Kundenbereich",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function VerifyEmailPage({ params }: Props) {
  const { token } = await params;
  const result = await verifyRegistrationToken(token);

  if ("error" in result && result.error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <h1 className="font-serif text-2xl text-charcoal mb-3">Link ungültig</h1>
          <p className="font-sans text-sm text-charcoal-light mb-6">{result.error}</p>
          <Link href="/kundenbereich/register" className="btn-primary">
            Erneut registrieren
          </Link>
        </div>
      </div>
    );
  }

  await createPortalSession(result.customer.id);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h1 className="font-serif text-2xl text-charcoal mb-3">Willkommen, {result.customer.name.split(" ")[0]}!</h1>
        <p className="font-sans text-sm text-charcoal-light mb-6">
          Ihr Konto wurde aktiviert. Ihr Zugangscode wurde per E-Mail gesendet.
        </p>
        <Link href="/kundenbereich" className="btn-primary">
          Zum Kundenbereich
        </Link>
      </div>
    </div>
  );
}
