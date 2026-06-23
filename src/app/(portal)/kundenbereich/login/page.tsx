import type { Metadata } from "next";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata: Metadata = {
  title: "Kundenbereich – Anmelden",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-6 bg-gradient-to-b from-offwhite to-sand-light/30">
      <LoginForm nextPath={next ?? "/kundenbereich"} />
    </div>
  );
}
