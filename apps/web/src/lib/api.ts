const API_BASE = "/api/carrier/ccf";

export type Carrier = {
  carrier_id: string;
  dot_number: string;
  legal_name: string;
  safety_rating: string;
  out_of_service_pct: number;
  crash_total: number;
  driver_oos_pct: number;
  insurance_on_file: boolean;
  authority_status: string;
  last_inspection_date: string;
  fleet_size?: number;
  score?: number | null;
  created_at?: string;
};

export type CarrierScoreHistory = {
  score: number;
  recorded_at: string;
};

export async function fetchCarriers(): Promise<Carrier[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch carriers");
  return res.json();
}

export async function fetchCarrierById(carrierId: string): Promise<Carrier | null> {
  const res = await fetch(`${API_BASE}/${carrierId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCarrierHistory(carrierId: string): Promise<CarrierScoreHistory[]> {
  const res = await fetch(`${API_BASE}/${carrierId}/history`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function uploadCCF(carriers: Omit<Carrier, "created_at">[]): Promise<Carrier[]> {
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carriers),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.mensage || "Failed to upload CCF");
  }
  return res.json();
}
