"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, ExternalLink, Download } from "lucide-react";
import { CRM_INPUT_SM } from "@/components/crm/crm-styles";

interface ProjectFile {
  id: string;
  url: string;
  originalName: string | null;
  category: string;
  description: string | null;
  uploadedBy: string;
  visibleToCustomer: boolean;
  createdAt: string;
}

const FILE_CATEGORIES = [
  { value: "offer", label: "Angebot" },
  { value: "invoice", label: "Rechnung" },
  { value: "measurement", label: "Massblatt" },
  { value: "photo", label: "Foto" },
  { value: "design", label: "Entwurf" },
  { value: "internal", label: "Intern" },
  { value: "other", label: "Sonstiges" },
];

interface Props {
  projectId: string;
  initialFiles: ProjectFile[];
}

function downloadHref(url: string, filename: string | null) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("cloudinary.com")) {
      // Insert fl_attachment for forced download when possible
      if (u.pathname.includes("/upload/")) {
        u.pathname = u.pathname.replace("/upload/", `/upload/fl_attachment:${encodeURIComponent(filename || "datei")}/`);
      }
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function FilesPanel({ projectId, initialFiles }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("photo");
  const [description, setDescription] = useState("");
  const [visibleToCustomer, setVisibleToCustomer] = useState(true);
  const [filterCat, setFilterCat] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("description", description);
      formData.append(
        "visibleToCustomer",
        category === "internal" ? "false" : String(visibleToCustomer)
      );
      const res = await fetch(`/admin/api/crm/projects/${projectId}/files`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Upload fehlgeschlagen.");
        return;
      }
      setDescription("");
      startTransition(() => router.refresh());
    } catch {
      setError("Keine Verbindung zum Server.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(fileId: string) {
    if (!confirm("Datei löschen?")) return;
    setError("");
    const res = await fetch(`/admin/api/crm/files/${fileId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Löschen fehlgeschlagen.");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function toggleVisibility(file: ProjectFile) {
    setError("");
    const res = await fetch(`/admin/api/crm/files/${file.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibleToCustomer: !file.visibleToCustomer }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Sichtbarkeit konnte nicht geändert werden.");
      return;
    }
    startTransition(() => router.refresh());
  }

  const filtered = filterCat
    ? initialFiles.filter((f) => f.category === filterCat)
    : initialFiles;

  const inputClass = CRM_INPUT_SM;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Datei hochladen</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {FILE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            className={`${inputClass} flex-1 min-w-[160px]`}
            placeholder="Beschreibung (opt.)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="inline-flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={category !== "internal" && visibleToCustomer}
              disabled={category === "internal"}
              onChange={(e) => setVisibleToCustomer(e.target.checked)}
              className="rounded border-gray-300"
            />
            Im Kundenportal sichtbar
          </label>
          <label
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium cursor-pointer transition-colors ${
              uploading ? "bg-gray-700 opacity-50" : "bg-violet-600 hover:bg-violet-500"
            }`}
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Wird hochgeladen…" : "Datei auswählen"}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
      )}

      {initialFiles.length > 3 && (
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterCat("")}
            className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${
              !filterCat ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Alle
          </button>
          {FILE_CATEGORIES.filter((c) => initialFiles.some((f) => f.category === c.value)).map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilterCat(c.value)}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${
                filterCat === c.value
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-8">Noch keine Dateien.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 truncate">{file.originalName ?? "Datei"}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded">
                      {FILE_CATEGORIES.find((c) => c.value === file.category)?.label ?? file.category}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        file.visibleToCustomer && file.category !== "internal"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {file.visibleToCustomer && file.category !== "internal"
                        ? "Kundenportal"
                        : "Nur intern"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(file.createdAt).toLocaleDateString("de-CH")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <a
                    href={downloadHref(file.url, file.originalName)}
                    download={file.originalName ?? undefined}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                    title="Herunterladen"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                    title="Öffnen"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(file.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {file.description && (
                <p className="text-[11px] text-gray-500 mb-2">{file.description}</p>
              )}
              {file.category !== "internal" && (
                <button
                  type="button"
                  onClick={() => toggleVisibility(file)}
                  className="text-[11px] text-violet-600 hover:underline"
                >
                  {file.visibleToCustomer
                    ? "Im Portal ausblenden"
                    : "Im Portal sichtbar machen"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
