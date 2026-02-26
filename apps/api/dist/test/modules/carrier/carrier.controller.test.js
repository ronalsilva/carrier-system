var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCarrierController, getCarrierHistoryController, getAllCarriersController, getCarrierController, } from '../../../modules/carrier/carrier.controller';
import { createCarrier, getCarrierHistory, getAllCarriers, getCarrierById, } from '../../../modules/carrier/carrier.service';
jest.mock('@modules/carrier/carrier.service');
const mockCreateCarrier = createCarrier;
const mockGetCarrierHistory = getCarrierHistory;
const mockGetAllCarriers = getAllCarriers;
const mockGetCarrierById = getCarrierById;
describe('Carrier Controller', () => {
    let mockRequest;
    let mockReply;
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {};
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });
    describe('createCarrierController', () => {
        it('deve criar carriers e retornar array de criados', () => __awaiter(void 0, void 0, void 0, function* () {
            const carriers = [
                {
                    carrier_id: 'carrier-1',
                    dot_number: '12345',
                    legal_name: 'Carrier One',
                    safety_rating: 'Satisfactory',
                    out_of_service_pct: 10,
                    crash_total: 2,
                    driver_oos_pct: 5,
                    insurance_on_file: true,
                    authority_status: 'Active',
                    last_inspection_date: '2024-01-15',
                    fleet_size: 50,
                },
            ];
            const createdCarrier = Object.assign(Object.assign({}, carriers[0]), { score: 85 });
            mockRequest.body = carriers;
            mockCreateCarrier.mockResolvedValue(createdCarrier);
            yield createCarrierController(mockRequest, mockReply);
            expect(mockCreateCarrier).toHaveBeenCalled();
            expect(mockReply.send).toHaveBeenCalledWith([createdCarrier]);
        }));
        it('deve processar múltiplos carriers', () => __awaiter(void 0, void 0, void 0, function* () {
            const carriers = [
                { carrier_id: 'c1', dot_number: '1', legal_name: 'C1', safety_rating: 'Satisfactory', out_of_service_pct: 0, crash_total: 0, driver_oos_pct: 0, insurance_on_file: true, authority_status: 'Active', last_inspection_date: '2024-01-01', fleet_size: 10 },
                { carrier_id: 'c2', dot_number: '2', legal_name: 'C2', safety_rating: 'Conditional', out_of_service_pct: 20, crash_total: 1, driver_oos_pct: 10, insurance_on_file: false, authority_status: 'Inactive', last_inspection_date: '2024-01-02', fleet_size: 20 },
            ];
            mockRequest.body = carriers;
            mockCreateCarrier
                .mockResolvedValueOnce({ carrier_id: 'c1', score: 90 })
                .mockResolvedValueOnce({ carrier_id: 'c2', score: 60 });
            yield createCarrierController(mockRequest, mockReply);
            expect(mockCreateCarrier).toHaveBeenCalledTimes(2);
            expect(mockReply.send).toHaveBeenCalledWith([
                { carrier_id: 'c1', score: 90 },
                { carrier_id: 'c2', score: 60 },
            ]);
        }));
        it('deve ignorar carriers que retornam undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const carriers = [
                { carrier_id: 'c1', dot_number: '1', legal_name: 'C1', safety_rating: 'Satisfactory', out_of_service_pct: 0, crash_total: 0, driver_oos_pct: 0, insurance_on_file: true, authority_status: 'Active', last_inspection_date: '2024-01-01', fleet_size: 10 },
            ];
            mockRequest.body = carriers;
            mockCreateCarrier.mockResolvedValue(undefined);
            yield createCarrierController(mockRequest, mockReply);
            expect(mockReply.send).toHaveBeenCalledWith([]);
        }));
    });
    describe('getCarrierHistoryController', () => {
        it('deve retornar histórico do carrier', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHistory = [
                { score: 85, recorded_at: new Date() },
                { score: 80, recorded_at: new Date() },
            ];
            mockRequest.params = { carrier_id: 'carrier-123' };
            mockGetCarrierHistory.mockResolvedValue(mockHistory);
            yield getCarrierHistoryController(mockRequest, mockReply);
            expect(mockGetCarrierHistory).toHaveBeenCalledWith('carrier-123');
            expect(mockReply.send).toHaveBeenCalledWith(mockHistory);
        }));
    });
    describe('getAllCarriersController', () => {
        it('deve retornar todos os carriers', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCarriers = [
                { carrier_id: 'c1', legal_name: 'Carrier 1', score: 85 },
            ];
            mockGetAllCarriers.mockResolvedValue(mockCarriers);
            yield getAllCarriersController(mockRequest, mockReply);
            expect(mockGetAllCarriers).toHaveBeenCalled();
            expect(mockReply.send).toHaveBeenCalledWith(mockCarriers);
        }));
    });
    describe('getCarrierController', () => {
        it('deve retornar carrier por id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCarrier = {
                carrier_id: 'carrier-123',
                legal_name: 'Test Carrier',
                score: 85,
            };
            mockRequest.params = { carrier_id: 'carrier-123' };
            mockGetCarrierById.mockResolvedValue(mockCarrier);
            yield getCarrierController(mockRequest, mockReply);
            expect(mockGetCarrierById).toHaveBeenCalledWith('carrier-123');
            expect(mockReply.send).toHaveBeenCalledWith(mockCarrier);
        }));
    });
});
//# sourceMappingURL=carrier.controller.test.js.map