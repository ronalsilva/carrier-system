var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCarrier, getCarrierHistory, getAllCarriers, getCarrierById, } from '../../../modules/carrier/carrier.service';
import handleError from '@utils/handleError';
jest.mock('@utils/dbConnection', () => {
    const mockCarrier = {
        findUnique: jest.fn(),
        upsert: jest.fn(),
        findMany: jest.fn(),
    };
    const mockCarrierScoreHistory = {
        create: jest.fn(),
        findMany: jest.fn(),
    };
    return {
        __esModule: true,
        default: {
            carrier: mockCarrier,
            carrierScoreHistory: mockCarrierScoreHistory,
        },
    };
});
jest.mock('@utils/handleError');
import prisma from '@utils/dbConnection';
const mockHandleError = handleError;
const mockCarrier = {
    carrier_id: 'carrier-123',
    dot_number: '12345',
    legal_name: 'Test Carrier',
    safety_rating: 'Satisfactory',
    out_of_service_pct: 10,
    crash_total: 2,
    driver_oos_pct: 5,
    insurance_on_file: true,
    authority_status: 'Active',
    last_inspection_date: '2024-01-15',
    fleet_size: 50,
};
describe('Carrier Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createCarrier', () => {
        it('deve retornar carrier existente quando content_hash for igual', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingCarrier = Object.assign(Object.assign({}, mockCarrier), { content_hash: 'same-hash' });
            prisma.carrier.findUnique.mockResolvedValue(Object.assign(Object.assign({}, existingCarrier), { content_hash: 'same-hash' }));
            const result = yield createCarrier(mockCarrier, 'same-hash');
            expect(prisma.carrier.findUnique).toHaveBeenCalledWith({
                where: { carrier_id: mockCarrier.carrier_id },
                select: expect.any(Object),
            });
            expect(prisma.carrier.upsert).not.toHaveBeenCalled();
            expect(result).toEqual(existingCarrier);
        }));
        it('deve criar/atualizar carrier quando content_hash for diferente', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdCarrier = Object.assign(Object.assign({}, mockCarrier), { score: 85 });
            prisma.carrier.findUnique.mockResolvedValue(null);
            prisma.carrier.upsert.mockResolvedValue(createdCarrier);
            prisma.carrierScoreHistory.create.mockResolvedValue({});
            const result = yield createCarrier(mockCarrier, 'new-hash');
            expect(prisma.carrier.upsert).toHaveBeenCalled();
            expect(prisma.carrierScoreHistory.create).toHaveBeenCalled();
            expect(result).toEqual(createdCarrier);
        }));
        it('deve chamar handleError quando ocorrer erro', () => __awaiter(void 0, void 0, void 0, function* () {
            const prismaError = { code: 'P2002' };
            prisma.carrier.findUnique.mockRejectedValue(prismaError);
            const result = yield createCarrier(mockCarrier, 'hash');
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
    });
    describe('getCarrierHistory', () => {
        it('deve retornar histórico de scores do carrier', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHistory = [
                { score: 85, recorded_at: new Date() },
                { score: 80, recorded_at: new Date() },
            ];
            prisma.carrierScoreHistory.findMany.mockResolvedValue(mockHistory);
            const result = yield getCarrierHistory('carrier-123');
            expect(prisma.carrierScoreHistory.findMany).toHaveBeenCalledWith({
                where: { carrier_id: 'carrier-123' },
                orderBy: { recorded_at: 'desc' },
                select: { score: true, recorded_at: true },
            });
            expect(result).toEqual(mockHistory);
        }));
        it('deve chamar handleError quando ocorrer erro', () => __awaiter(void 0, void 0, void 0, function* () {
            const prismaError = { code: 'P1001' };
            prisma.carrierScoreHistory.findMany.mockRejectedValue(prismaError);
            const result = yield getCarrierHistory('carrier-123');
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
    });
    describe('getAllCarriers', () => {
        it('deve retornar todos os carriers', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCarriers = [mockCarrier];
            prisma.carrier.findMany.mockResolvedValue(mockCarriers);
            const result = yield getAllCarriers();
            expect(prisma.carrier.findMany).toHaveBeenCalledWith({
                select: expect.any(Object),
            });
            expect(result).toEqual(mockCarriers);
        }));
        it('deve chamar handleError quando ocorrer erro', () => __awaiter(void 0, void 0, void 0, function* () {
            const prismaError = { code: 'P1001' };
            prisma.carrier.findMany.mockRejectedValue(prismaError);
            const result = yield getAllCarriers();
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
    });
    describe('getCarrierById', () => {
        it('deve retornar carrier por id', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.carrier.findUnique.mockResolvedValue(mockCarrier);
            const result = yield getCarrierById('carrier-123');
            expect(prisma.carrier.findUnique).toHaveBeenCalledWith({
                where: { carrier_id: 'carrier-123' },
                select: expect.any(Object),
            });
            expect(result).toEqual(mockCarrier);
        }));
        it('deve chamar handleError quando ocorrer erro', () => __awaiter(void 0, void 0, void 0, function* () {
            const prismaError = { code: 'P2025' };
            prisma.carrier.findUnique.mockRejectedValue(prismaError);
            const result = yield getCarrierById('carrier-123');
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
    });
});
//# sourceMappingURL=carrier.service.test.js.map