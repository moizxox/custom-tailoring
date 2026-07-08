import type { Metadata } from "next";
import { GroupForm } from "@/components/crm/GroupForm";

export const metadata: Metadata = { title: "Neue Gruppe — CRM" };

export default function NewGroupPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Neue Gruppe</h1>
        <p className="text-sm text-gray-400 mt-1">Guggenmusik, Clique, Verein oder andere Gruppe anlegen.</p>
      </div>
      <GroupForm />
    </div>
  );
}
