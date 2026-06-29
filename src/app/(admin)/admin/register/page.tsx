"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PasswordInput from "@/components/admin/PasswordInput";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await fetch("/admin/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("registerFailed"));
        return;
      }
      router.push("/admin/login");
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("registerTitle")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("registerSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">{t("nameLabel")}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
                placeholder={t("namePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">{t("usernameLabel")}</label>
              <input
                id="username"
                type="text"
                required
                pattern="[a-z0-9_]{3,30}"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
                placeholder={t("usernamePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">{t("emailLabel")}</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">{t("passwordLabel")}</label>
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
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1.5">{t("confirmPasswordLabel")}</label>
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
              {loading ? t("registering") : t("createAccount")}
            </button>

            <div className="text-center">
              <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-700">
                {t("alreadyHaveAccount")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
