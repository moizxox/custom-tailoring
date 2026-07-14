"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";

interface MediaFile {
  id: string;
  url: string;
  altText: string | null;
  filename: string;
  createdAt: string;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl);
}

async function fetchImageBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.blob();
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
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
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } finally {
      setDeleting(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(files.map((f) => f.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function downloadOne(file: MediaFile) {
    setDownloadingId(file.id);
    try {
      const blob = await fetchImageBlob(file.url);
      triggerBlobDownload(blob, file.filename || "image");
    } catch {
      setUploadError(t("downloadFailed"));
    } finally {
      setDownloadingId(null);
    }
  }

  async function downloadSelected() {
    const chosen = files.filter((f) => selected.has(f.id));
    if (chosen.length === 0) return;

    if (chosen.length === 1) {
      await downloadOne(chosen[0]);
      return;
    }

    setDownloading(true);
    setUploadError("");
    try {
      const zip = new JSZip();
      const usedNames = new Set<string>();

      await Promise.all(
        chosen.map(async (file) => {
          const blob = await fetchImageBlob(file.url);
          let name = file.filename || `image-${file.id}`;
          if (usedNames.has(name)) {
            const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
            const base = ext ? name.slice(0, -ext.length) : name;
            let i = 2;
            while (usedNames.has(`${base}-${i}${ext}`)) i += 1;
            name = `${base}-${i}${ext}`;
          }
          usedNames.add(name);
          zip.file(name, blob);
        }),
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      triggerBlobDownload(zipBlob, "media-export.zip");
    } catch {
      setUploadError(t("downloadFailed"));
    } finally {
      setDownloading(false);
    }
  }

  const allSelected = files.length > 0 && selected.size === files.length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("count", { count: files.length })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {files.length > 0 && (
            <>
              <button
                type="button"
                onClick={allSelected ? clearSelection : selectAll}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                {allSelected ? t("clearSelection") : t("selectAll")}
              </button>
              {selected.size > 0 && (
                <button
                  type="button"
                  onClick={downloadSelected}
                  disabled={downloading}
                  className="px-3 py-2 text-sm font-medium text-white bg-periwinkle-600 hover:bg-periwinkle-700 rounded-lg transition disabled:opacity-60"
                >
                  {downloading
                    ? t("downloading")
                    : t("downloadSelected", { count: selected.size })}
                </button>
              )}
            </>
          )}
          <label className={`px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white text-sm font-medium rounded-lg transition cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
            {uploading ? t("uploading") : t("upload")}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
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
          {files.map((file) => {
            const isSelected = selected.has(file.id);
            return (
              <div
                key={file.id}
                className={`group relative bg-white rounded-xl border overflow-hidden transition ${
                  isSelected ? "border-periwinkle-500 ring-2 ring-periwinkle-200" : "border-gray-200"
                }`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(file.id)}
                    className="w-4 h-4 rounded border-gray-300 text-periwinkle-600 focus:ring-periwinkle-500 cursor-pointer"
                    aria-label={t("selectImage")}
                  />
                </div>
                <div className="aspect-square">
                  <img src={file.url} alt={file.altText ?? file.filename} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 pt-8">
                  <button
                    type="button"
                    onClick={() => downloadOne(file)}
                    disabled={downloadingId === file.id}
                    className="w-full px-3 py-1.5 bg-periwinkle-600 text-white text-xs font-medium rounded-lg hover:bg-periwinkle-700 disabled:opacity-60 transition"
                  >
                    {downloadingId === file.id ? "…" : t("download")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyUrl(file.url)}
                    className="w-full px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-100 transition"
                  >
                    {copied === file.url ? t("copied") : t("copyUrl")}
                  </button>
                  <button
                    type="button"
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
            );
          })}
        </div>
      )}
    </div>
  );
}
