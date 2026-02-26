// --- AI-ASSISTED --- 
// Tool: Composer 1.5 
// Prompt: "Create a minimalist layout where you create a table with all existing carriers. At the top, create a JSON upload with the carrier registration. Below is the list of APIs: List of APIs created: fetchCarriers, fetchCarrierHistory, type Carrier. The table should have the following columns: Legal Name, DOT Number, Score, Authority Status. The table should be styled with Tailwind CSS." 
// Modifications: I redid it to include separation by score... made the table more readable. 
// --- END AI-ASSISTED ---

"use client";

import { useCallback, useState } from "react";
import { CarrierTable } from "@/components/CarrierTable";
import { CCFUpload } from "@/components/CCFUpload";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">Carrier Dashboard</h1>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Upload CCF</h2>
          <CCFUpload onSuccess={handleUploadSuccess} />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Carriers</h2>
          <CarrierTable key={refreshKey} />
        </section>
      </div>
    </main>
  );
}
