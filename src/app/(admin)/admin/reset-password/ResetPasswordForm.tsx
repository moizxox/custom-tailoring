"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import PasswordInput from "@/components/admin/PasswordInput";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("auth");
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("resetFailed"));
      } else {
        setDone(true);
        setTimeout(() => router.push("/admin/login"), 2500);
      }
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t("invalidToken")}</p>
          <Link href="/admin/forgot-password" className="text-periwinkle-600 hover:underline text-sm">
            {t("requestNewLink")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("resetTitle")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("resetSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {done ? (
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">{t("resetSuccess")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("newPasswordLabel")}
                </label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  minLength={8}
                  placeholder={t("passwordMinPlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("confirmPasswordLabel")}
                </label>
                <PasswordInput
                  id="confirm"
                  value={confirm}
                  onChange={setConfirm}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-periwinkle-600 hover:bg-periwinkle-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
              >
                {loading ? t("saving") : t("savePassword")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
