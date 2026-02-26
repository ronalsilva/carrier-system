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
    // I removed the authentication from the API routes for testing purposes. It's still in the Swagger UI.
    // fastify.post("/ccf/upload", { preHandler: [fastify.authenticate], schema: createCarrierSchema }, createCarrierController);
    fastify.post("/ccf/upload", { schema: createCarrierSchema }, createCarrierController);
    fastify.get("/ccf", { schema: getAllCarriersSchema }, getAllCarriersController);
    fastify.get("/ccf/:carrier_id", { schema: getCarrierSchema }, getCarrierController);
    fastify.get("/ccf/:carrier_id/history", { schema: getCarrierHistorySchema }, getCarrierHistoryController);
}

export default carrierRoutes;