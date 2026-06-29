import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex bg-gray-50/70">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader user={session.user} />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
