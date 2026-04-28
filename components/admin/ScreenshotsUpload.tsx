"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Plus, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ScreenshotsUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const { startUpload, isUploading } = useUploadThing("screenshotUploader", {
    onClientUploadComplete: (res) => {
      onChange([...value, ...res.map(f => f.url)]);
      setUploadError("");
    },
    onUploadError: (err) => setUploadError(err.message),
  });

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError("");
    startUpload(Array.from(files));
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url || value.includes(url)) return;
    onChange([...value, url]);
    setUrlInput("");
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const remaining = 6 - value.length;

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative h-24 rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={url}
                alt={`Screenshot ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={url.startsWith("http")}
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 size-5 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {remaining > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Plus size={12} />
                Subir ({value.length}/6)
              </>
            )}
          </button>

          <span className="text-xs text-muted-foreground">o</span>

          <div className="flex flex-1 min-w-0 gap-2">
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addUrl())}
              placeholder="pegar URL y Enter..."
              className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={addUrl}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-accent transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {value.length >= 6 && (
        <p className="text-xs text-muted-foreground">Máximo 6 screenshots alcanzado.</p>
      )}

      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
    </div>
  );
}
