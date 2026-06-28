"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface MediaFile {
  id: string;
  url: string;
  altText: string | null;
  filename: string;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const t = useTranslations("media");
  const tc = useTranslations("common");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await fetch("/admin/api/upload");
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name.replace(/\.[^.]+$/, ""));
    try {
      const res = await fetch("/admin/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setUploadError(data.error ?? t("uploadFailed"));
      } else {
        await loadFiles();
      }
    } catch {
      setUploadError(tc("networkError"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/admin/api/media/${id}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("count", { count: files.length })}</p>
        </div>
        <label className={`px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white text-sm font-medium rounded-lg transition cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          {uploading ? t("uploading") : t("upload")}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {uploadError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {uploadError}
          {uploadError.includes("Cloudinary") && (
            <p className="mt-1 text-xs text-red-500">{t("cloudinaryHint")}</p>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-gray-400 text-sm">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((file) => (
            <div key={file.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-square">
                <img src={file.url} alt={file.altText ?? file.filename} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="w-full px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-100 transition"
                >
                  {copied === file.url ? t("copied") : t("copyUrl")}
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={deleting === file.id}
                  className="w-full px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-60 transition"
                >
                  {deleting === file.id ? "…" : t("delete")}
                </button>
              </div>
              <div className="p-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 truncate">{file.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
