import type { Metadata } from "next";
import { CustomerForm } from "@/components/crm/CustomerForm";

export const metadata: Metadata = { title: "Neuer Kunde — CRM" };

export default function NewCustomerPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Neuer Kunde</h1>
        <p className="text-sm text-gray-400 mt-1">
          Kundendaten eingeben. Der Zugangscode wird automatisch generiert.
        </p>
      </div>
      <CustomerForm />
    </div>
  );
}
