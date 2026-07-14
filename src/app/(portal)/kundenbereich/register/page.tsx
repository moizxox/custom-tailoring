import type { Metadata } from "next";
import { RegisterForm } from "@/components/portal/RegisterForm";

export const metadata: Metadata = {
  title: "Registrieren — Kundenbereich",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
}
