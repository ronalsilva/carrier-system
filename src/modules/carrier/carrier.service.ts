import { Carrier, CarrierScoreHistory } from "@prisma/client";
import prisma from "@utils/dbConnection";
import handleError from "@utils/handleError";
import { calculateCarrierScore } from "./carrier.utils";

export async function createCarrier(carrier: Carrier, incomingHash: string): Promise<Carrier | void> {
    try {
        const existing = await prisma.carrier.findUnique({
            where: { carrier_id: carrier.carrier_id },
            select: { content_hash: true, carrier_id: true, dot_number: true, legal_name: true, safety_rating: true, out_of_service_pct: true, crash_total: true, driver_oos_pct: true, insurance_on_file: true, authority_status: true, last_inspection_date: true, fleet_size: true, score: true, created_at: true },
        });

        if (existing?.content_hash === incomingHash) {
            return existing as Carrier;
        }

        const score = calculateCarrierScore({
            safety_rating: carrier.safety_rating,
            out_of_service_pct: carrier.out_of_service_pct,
            crash_total: carrier.crash_total,
            driver_oos_pct: carrier.driver_oos_pct,
            insurance_on_file: carrier.insurance_on_file,
            authority_status: carrier.authority_status,
        });

        const result = await prisma.carrier.upsert({
            where: { carrier_id: carrier.carrier_id },
            create: { ...carrier, score, content_hash: incomingHash, created_at: new Date() },
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

        await prisma.carrierScoreHistory.create({
            data: {
                carrier_id: result.carrier_id,
                score: score,
            }
        });

        return result as Carrier;
    } catch (err: any) {
        handleError(err);
    }
}

export async function getCarrierHistory(carrierId: string): Promise<CarrierScoreHistory[] | void> {
    try {
        const result = await prisma.carrierScoreHistory.findMany({
            where: { carrier_id: carrierId },
            orderBy: { recorded_at: 'desc' },
            select: {
                score: true,
                recorded_at: true,
            }
        });

        return result as CarrierScoreHistory[];
    } catch (err: any) {
        handleError(err);
    }
}

export async function getAllCarriers(): Promise<Carrier[] | void> {
    try {
        const result = await prisma.carrier.findMany({
            select: { carrier_id: true, dot_number: true, legal_name: true, safety_rating: true, out_of_service_pct: true, crash_total: true, driver_oos_pct: true, insurance_on_file: true, authority_status: true, last_inspection_date: true, fleet_size: true, score: true, created_at: true },
        });
        return result as Carrier[];
    } catch (err: any) {
        handleError(err);
    }
}

export async function getCarrierById(carrierId: string): Promise<Carrier | void> {
    try {
        const result = await prisma.carrier.findUnique({
            where: { carrier_id: carrierId },
            select: { carrier_id: true, dot_number: true, legal_name: true, safety_rating: true, out_of_service_pct: true, crash_total: true, driver_oos_pct: true, insurance_on_file: true, authority_status: true, last_inspection_date: true, fleet_size: true, score: true, created_at: true },
        });
        return result as Carrier;
    } catch (err: any) {
        handleError(err);
    }
}