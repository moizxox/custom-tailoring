"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="text-xs font-sans text-charcoal-light hover:text-charcoal border border-stone-light rounded-full px-3 py-1.5 transition-colors"
      onClick={async () => {
        await fetch("/kundenbereich/api/auth/logout", { method: "POST" });
        window.location.href = "/kundenbereich/login";
      }}
    >
      Abmelden
    </button>
  );
}
