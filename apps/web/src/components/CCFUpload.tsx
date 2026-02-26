"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { uploadCCF, type Carrier } from "@/lib/api";

const CCF_ACCEPT = ".json,application/json";

export function CCFUpload({ onSuccess }: { onSuccess?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const carriers: Carrier[] = Array.isArray(data) ? data : [data];

        if (carriers.length === 0) {
          toast.error("Arquivo vazio", { description: "O arquivo CCF não contém carriers." });
          return;
        }

        const created = await uploadCCF(carriers);

        toast.success("CCF processado com sucesso", {
          description: `${created.length} carrier(s) processado(s) de ${carriers.length} no arquivo.`,
        });
        onSuccess?.();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao processar arquivo CCF.";
        toast.error("Erro no upload", { description: msg });
      }
    },
    [onSuccess]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".json") || file.type === "application/json")) {
      handleFile(file);
    } else {
      toast.error("Formato inválido", { description: "Use um arquivo JSON (.json)." });
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-8 py-10 transition-colors hover:border-slate-400 hover:bg-slate-100/80"
    >
      <input
        ref={inputRef}
        type="file"
        accept={CCF_ACCEPT}
        onChange={onInputChange}
        className="hidden"
      />
      <svg
        className="mb-3 h-12 w-12 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="mb-1 text-sm font-medium text-slate-700">Upload CCF (JSON)</p>
      <p className="text-xs text-slate-500">Arraste o arquivo ou clique para selecionar</p>
    </div>
  );
}
