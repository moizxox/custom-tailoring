import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-500">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
