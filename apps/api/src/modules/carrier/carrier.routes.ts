import { FastifyInstance } from "fastify";
import { 
    createCarrierController, 
    getCarrierHistoryController,
    getAllCarriersController,
    getCarrierController
} from "./carrier.controller";

import { 
    createCarrierSchema, 
    getCarrierHistorySchema,
    getAllCarriersSchema,
    getCarrierSchema
} from "./carrier.schemas";

async function carrierRoutes(fastify: FastifyInstance) {
    fastify.post("/ccf/upload", { schema: createCarrierSchema }, createCarrierController);
    fastify.get("/ccf", { schema: getAllCarriersSchema }, getAllCarriersController);
    fastify.get("/ccf/:carrier_id", { schema: getCarrierSchema }, getCarrierController);
    fastify.get("/ccf/:carrier_id/history", { schema: getCarrierHistorySchema }, getCarrierHistoryController);
}

export default carrierRoutes;