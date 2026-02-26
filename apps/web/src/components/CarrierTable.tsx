"use client";

import { useState, useEffect } from "react";
import { fetchCarriers, fetchCarrierHistory, type Carrier } from "@/lib/api";

function getScoreColor(score: number | null | undefined): string {
  if (score == null) return "text-gray-500";
  if (score > 70) return "text-emerald-600 font-semibold";
  if (score >= 40) return "text-amber-600 font-semibold";
  return "text-red-600 font-semibold";
}

function getScoreBgColor(score: number | null | undefined): string {
  if (score == null) return "bg-gray-100 text-gray-600";
  if (score > 70) return "bg-emerald-100 text-emerald-800";
  if (score >= 40) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

const SAFETY_WEIGHTS: Record<string, number> = {
  Satisfactory: 1,
  Conditional: 0.5,
  Unsatisfactory: 0,
};

const AUTHORITY_WEIGHTS: Record<string, number> = {
  Active: 1,
  Inactive: 0.5,
  Revoked: 0,
};

function computeScoreBreakdown(carrier: Carrier) {
  const safetyScore = (SAFETY_WEIGHTS[carrier.safety_rating] ?? 0) * 100;
  const oosScore = (1 - carrier.out_of_service_pct / 100) * 100;
  const crashScore = (1 - Math.min(carrier.crash_total, 10) / 10) * 100;
  const driverOosScore = (1 - carrier.driver_oos_pct / 100) * 100;
  const insuranceScore = carrier.insurance_on_file ? 100 : 0;
  const authorityScore = (AUTHORITY_WEIGHTS[carrier.authority_status] ?? 0) * 100;

  return [
    { key: "safety_rating", label: "Safety Rating", value: carrier.safety_rating, score: Math.round(safetyScore), weight: "25%" },
    { key: "out_of_service_pct", label: "Out of Service %", value: `${carrier.out_of_service_pct}%`, score: Math.round(oosScore), weight: "20%" },
    { key: "crash_total", label: "Crash Total", value: carrier.crash_total, score: Math.round(crashScore), weight: "20%" },
    { key: "driver_oos_pct", label: "Driver OOS %", value: `${carrier.driver_oos_pct}%`, score: Math.round(driverOosScore), weight: "15%" },
    { key: "insurance_on_file", label: "Insurance on File", value: carrier.insurance_on_file ? "Yes" : "No", score: insuranceScore, weight: "10%" },
    { key: "authority_status", label: "Authority Status", value: carrier.authority_status, score: Math.round(authorityScore), weight: "10%" },
  ];
}

function CarrierDetail({ carrier }: { carrier: Carrier }) {
  const [history, setHistory] = useState<{ score: number; recorded_at: string }[]>([]);
  const breakdown = computeScoreBreakdown(carrier);

  useEffect(() => {
    fetchCarrierHistory(carrier.carrier_id).then(setHistory);
  }, [carrier.carrier_id]);

  return (
    <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Score Breakdown</h4>
          <div className="space-y-2">
            {breakdown.map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm shadow-sm">
                <span className="text-slate-700">{item.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{item.value}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getScoreBgColor(item.score)}`}>
                    {item.score} pts ({item.weight})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Score History</h4>
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.slice(0, 10).map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm shadow-sm">
                  <span className="text-slate-600">{new Date(h.recorded_at).toLocaleDateString("pt-BR")}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getScoreBgColor(h.score)}`}>
                    {h.score}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded bg-white px-3 py-4 text-sm text-slate-500 shadow-sm">No history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function CarrierTable() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCarriers()
      .then(setCarriers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    fetchCarriers()
      .then(setCarriers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Error loading carriers</p>
        <p className="mt-1 text-sm">{error}</p>
        <button
          onClick={refresh}
          className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (carriers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
        <p>No carriers found. Upload a CCF file to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Legal Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                DOT Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Authority Status
              </th>
            </tr>
          </thead>
          <tbody>
            {carriers.map((carrier) => (
              <>
                <tr
                  key={carrier.carrier_id}
                  onClick={() => setExpandedId(expandedId === carrier.carrier_id ? null : carrier.carrier_id)}
                  className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{carrier.legal_name}</td>
                  <td className="px-6 py-4 text-slate-600">{carrier.dot_number}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getScoreBgColor(
                        carrier.score
                      )} ${getScoreColor(carrier.score)}`}
                    >
                      {carrier.score ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        carrier.authority_status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : carrier.authority_status === "Inactive"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {carrier.authority_status}
                    </span>
                  </td>
                </tr>
                {expandedId === carrier.carrier_id && (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <CarrierDetail carrier={carrier} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
