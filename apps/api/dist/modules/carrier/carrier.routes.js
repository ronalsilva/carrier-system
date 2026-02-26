var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCarrierController, getCarrierHistoryController, getAllCarriersController, getCarrierController } from "./carrier.controller";
import { createCarrierSchema, getCarrierHistorySchema, getAllCarriersSchema, getCarrierSchema } from "./carrier.schemas";
function carrierRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // I removed the authentication from the API routes for testing purposes. It's still in the Swagger UI.
        // fastify.post("/ccf/upload", { preHandler: [fastify.authenticate], schema: createCarrierSchema }, createCarrierController);
        fastify.post("/ccf/upload", { schema: createCarrierSchema }, createCarrierController);
        fastify.get("/ccf", { schema: getAllCarriersSchema }, getAllCarriersController);
        fastify.get("/ccf/:carrier_id", { schema: getCarrierSchema }, getCarrierController);
        fastify.get("/ccf/:carrier_id/history", { schema: getCarrierHistorySchema }, getCarrierHistoryController);
    });
}
export default carrierRoutes;
//# sourceMappingURL=carrier.routes.js.map