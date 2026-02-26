import { createHash } from "crypto";
export function computeCarrierHash(carrier) {
    const HASH_FIELDS = [
        "dot_number",
        "legal_name",
        "safety_rating",
        "out_of_service_pct",
        "crash_total",
        "driver_oos_pct",
        "insurance_on_file",
        "authority_status",
        "last_inspection_date",
        "fleet_size",
    ];
    const canonical = {};
    for (const key of HASH_FIELDS) {
        if (key in carrier) {
            canonical[key] = carrier[key];
        }
    }
    const json = JSON.stringify(canonical);
    return createHash("sha256").update(json).digest("hex");
}
export function calculateCarrierScore(carrier) {
    var _a, _b;
    const SAFETY_WEIGHTS = {
        Satisfactory: 1,
        Conditional: 0.5,
        Unsatisfactory: 0,
    };
    const AUTHORITY_WEIGHTS = {
        Active: 1,
        Inactive: 0.5,
        Revoked: 0,
    };
    const safetyScore = (_a = SAFETY_WEIGHTS[carrier.safety_rating]) !== null && _a !== void 0 ? _a : 0;
    const oosScore = 1 - carrier.out_of_service_pct / 100;
    const crashScore = 1 - Math.min(carrier.crash_total, 10) / 10;
    const driverOosScore = 1 - carrier.driver_oos_pct / 100;
    const insuranceScore = carrier.insurance_on_file ? 1 : 0;
    const authorityScore = (_b = AUTHORITY_WEIGHTS[carrier.authority_status]) !== null && _b !== void 0 ? _b : 0;
    const score = safetyScore * 0.25 +
        oosScore * 0.2 +
        crashScore * 0.2 +
        driverOosScore * 0.15 +
        insuranceScore * 0.1 +
        authorityScore * 0.1;
    return Math.round(Math.max(0, Math.min(100, score * 100)));
}
//# sourceMappingURL=carrier.utils.js.map