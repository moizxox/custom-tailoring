"use client";

import { useState, useEffect } from "react";

interface MediaFile {
  id: string;
  url: string;
  altText: string | null;
  filename: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function MediaPickerModal({ onSelect, onClose }: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/admin/api/upload")
      .then((r) => r.json())
      .then((data) => setFiles(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Bild aus Medienbibliothek wählen</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="p-5 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />)}
            </div>
          ) : files.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Keine Bilder vorhanden. Laden Sie zuerst Bilder hoch.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onSelect(file.url)}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-periwinkle-500 transition-all"
                >
                  <img src={file.url} alt={file.altText ?? file.filename} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
