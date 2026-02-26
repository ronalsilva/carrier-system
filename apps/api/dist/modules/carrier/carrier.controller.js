var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCarrier, getAllCarriers, getCarrierHistory, getCarrierById } from "./carrier.service";
import { computeCarrierHash } from "./carrier.utils";
export function createCarrierController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const carriers = request.body;
        const createdCarriers = [];
        for (const carrier of carriers) {
            const incomingHash = computeCarrierHash(carrier);
            const carrierData = yield createCarrier(carrier, incomingHash);
            if (carrierData) {
                createdCarriers.push(carrierData);
            }
        }
        return response.send(createdCarriers);
    });
}
export function getCarrierHistoryController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const carrierId = request.params.carrier_id;
        const carrierHistory = yield getCarrierHistory(carrierId);
        return response.send(carrierHistory);
    });
}
export function getAllCarriersController(_, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const carriers = yield getAllCarriers();
        return response.send(carriers);
    });
}
export function getCarrierController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const carrierId = request.params.carrier_id;
        const carrier = yield getCarrierById(carrierId);
        return response.send(carrier);
    });
}
//# sourceMappingURL=carrier.controller.js.map