var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "@utils/dbConnection";
import handleError from "@utils/handleError";
import { calculateCarrierScore } from "./carrier.utils";
export function createCarrier(carrier, incomingHash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existing = yield prisma.carrier.findUnique({
                where: { carrier_id: carrier.carrier_id },
                select: { content_hash: true, carrier_id: true, dot_number: true, legal_name: true, safety_rating: true, out_of_service_pct: true, crash_total: true, driver_oos_pct: true, insurance_on_file: true, authority_status: true, last_inspection_date: true, fleet_size: true, score: true, created_at: true },
            });
            if ((existing === null || existing === void 0 ? void 0 : existing.content_hash) === incomingHash) {
                return existing;
            }
            const score = calculateCarrierScore({
                safety_rating: carrier.safety_rating,
                out_of_service_pct: carrier.out_of_service_pct,
                crash_total: carrier.crash_total,
                driver_oos_pct: carrier.driver_oos_pct,
                insurance_on_file: carrier.insurance_on_file,
                authority_status: carrier.authority_status,
            });
            const result = yield prisma.carrier.upsert({
                where: { carrier_id: carrier.carrier_id },
                create: Object.assign(Object.assign({}, carrier), { score, content_hash: incomingHash, created_at: new Date() }),
                update: {
                    legal_name: carrier.legal_name,
                    safety_rating: carrier.safety_rating,
                    out_of_service_pct: carrier.out_of_service_pct,
                    crash_total: carrier.crash_total,
                    driver_oos_pct: carrier.driver_oos_pct,
                    insurance_on_file: carrier.insurance_on_file,
                    authority_status: carrier.authority_status,
                    last_inspection_date: carrier.last_inspection_date,
                    fleet_size: carrier.fleet_size,
                    score,
                    content_hash: incomingHash,
                },
                select: {
                    carrier_id: true,
                    dot_number: true,
                    legal_name: true,
                    safety_rating: true,
                    out_of_service_pct: true,
                    crash_total: true,
                    driver_oos_pct: true,
                    insurance_on_file: true,
                    authority_status: true,
                    last_inspection_date: true,
                    fleet_size: true,
                    score: true,
                    created_at: true,
                }
            });
            yield prisma.carrierScoreHistory.create({
                data: {
                    carrier_id: result.carrier_id,
                    score: score,
                }
            });
            return result;
        }
        catch (err) {
            handleError(err);
        }
    });
}
export function getCarrierHistory(carrierId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.carrierScoreHistory.findMany({
                where: { carrier_id: carrierId },
                orderBy: { recorded_at: 'desc' },
                select: {
                    score: true,
                    recorded_at: true,
                }
            });
            return result;
        }
        catch (err) {
            handleError(err);
        }
    });
}
export function getAllCarriers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.carrier.findMany({
                select: { carrier_id: true, dot_number: true, legal_name: true, safety_rating: true, out_of_service_pct: true, crash_total: true, driver_oos_pct: true, insurance_on_file: true, authority_status: true, last_inspection_date: true, fleet_size: true, score: true, created_at: true },
            });
            return result;
        }
        catch (err) {
            handleError(err);
        }
    });
}
export function getCarrierById(carrierId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.carrier.findUnique({
                where: { carrier_id: carrierId },
                select: { carrier_id: true, dot_number: true, legal_name: true, safety_rating: true, out_of_service_pct: true, crash_total: true, driver_oos_pct: true, insurance_on_file: true, authority_status: true, last_inspection_date: true, fleet_size: true, score: true, created_at: true },
            });
            return result;
        }
        catch (err) {
            handleError(err);
        }
    });
}
//# sourceMappingURL=carrier.service.js.map