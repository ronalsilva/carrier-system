import { FastifyRequest, FastifyReply } from "fastify";
import { Carrier } from "@prisma/client";
import { 
    createCarrier, 
    getAllCarriers, 
    getCarrierHistory, 
    getCarrierById 
} from "./carrier.service";
import { computeCarrierHash } from "./carrier.utils";

export async function createCarrierController(request: FastifyRequest<{ Body: Carrier }>, response: FastifyReply): Promise<FastifyReply> {
    const carriers = request.body;
    const createdCarriers = [];
    for (const carrier of carriers as unknown as Carrier[]) {
        const incomingHash = computeCarrierHash(carrier as Carrier);
        const carrierData = await createCarrier(carrier as Carrier, incomingHash);
        if (carrierData) {
            createdCarriers.push(carrierData as Carrier);
        }
    }
    
    return response.send(createdCarriers as Carrier[]);
}

export async function getCarrierHistoryController(request: FastifyRequest<{ Params: { carrier_id: string } }>, response: FastifyReply): Promise<FastifyReply> {
    const carrierId = request.params.carrier_id;
    const carrierHistory = await getCarrierHistory(carrierId);
    return response.send(carrierHistory);
}

export async function getAllCarriersController(_: FastifyRequest, response: FastifyReply): Promise<FastifyReply> {
    const carriers = await getAllCarriers();
    return response.send(carriers);
}

export async function getCarrierController(request: FastifyRequest<{ Params: { carrier_id: string } }>, response: FastifyReply): Promise<FastifyReply> {
    const carrierId = request.params.carrier_id;
    const carrier = await getCarrierById(carrierId);
    return response.send(carrier);
}