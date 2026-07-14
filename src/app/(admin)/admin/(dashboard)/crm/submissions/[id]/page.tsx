import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getContactSubmission } from "@/lib/crm/contact-submissions";
import { ConvertSubmissionPanel, MarkReadButton } from "@/components/crm/ContactSubmissionPanel";

interface Props {
  params: Promise<{ id: string }>;
}

const LOCATION_LABELS: Record<string, string> = {
  pratteln: "Atelier Pratteln",
  therwil: "Atelier Therwil",
  unsicher: "Noch unentschlossen",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const submission = await getContactSubmission(id);
  return { title: submission ? `Anfrage — ${submission.name}` : "Anfrage" };
}

export default async function ContactSubmissionDetailPage({ params }: Props) {
  const { id } = await params;
  const submission = await getContactSubmission(id);
  if (!submission) notFound();

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/admin/crm/submissions" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
            Anfragen
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-xs text-gray-400">{submission.name}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{submission.name}</h1>
            <p className="text-sm text-gray-400 mt-1">
              Eingegangen am {new Date(submission.createdAt).toLocaleString("de-CH")}
            </p>
          </div>
          <MarkReadButton submissionId={submission.id} isRead={submission.read} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Kontaktdaten</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-gray-500">E-Mail</dt>
              <dd>
                <a href={`mailto:${submission.email}`} className="text-violet-600 hover:underline">
                  {submission.email}
                </a>
              </dd>
            </div>
            {submission.phone && (
              <div>
                <dt className="text-xs text-gray-500">Telefon</dt>
                <dd className="text-gray-900">{submission.phone}</dd>
              </div>
            )}
            {submission.location && (
              <div>
                <dt className="text-xs text-gray-500">Standort</dt>
                <dd className="text-gray-900">
                  {LOCATION_LABELS[submission.location] ?? submission.location}
                </dd>
              </div>
            )}
          </dl>

          <div>
            <h3 className="text-xs text-gray-500 mb-2">Nachricht</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-4 border border-gray-100">
              {submission.message}
            </p>
          </div>
        </div>

        <ConvertSubmissionPanel
          submission={{
            ...submission,
            createdAt: submission.createdAt.toISOString(),
            convertedAt: submission.convertedAt?.toISOString() ?? null,
          }}
        />
      </div>
    </div>
  );
}
