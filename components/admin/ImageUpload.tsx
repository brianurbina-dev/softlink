"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  value: string;
  onChange: (url: string) => void;
  endpoint?: "imageUploader" | "screenshotUploader";
  aspectRatio?: "square" | "wide";
}

export function ImageUpload({
  value,
  onChange,
  endpoint = "imageUploader",
  aspectRatio = "wide",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res[0]) onChange(res[0].url);
      setUploadError("");
    },
    onUploadError: (err) => setUploadError(err.message),
  });

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError("");
    startUpload(Array.from(files));
  };

  const previewClass = aspectRatio === "square"
    ? "h-28 w-28 rounded-full"
    : "h-36 w-full rounded-lg";

  return (
    <div className="space-y-2">
      {value && (
        <div className={`relative overflow-hidden border border-border bg-muted ${previewClass}`}>
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={value.startsWith("http")}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 size-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
          >
            <X size={11} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

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
              <Upload size={12} />
              {value ? "Cambiar imagen" : "Subir imagen"}
            </>
          )}
        </button>

        <span className="text-xs text-muted-foreground">o</span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="pegar URL..."
          className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50 placeholder:text-muted-foreground"
        />
      </div>

      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
