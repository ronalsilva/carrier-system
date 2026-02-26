import {
  createCarrier,
  getCarrierHistory,
  getAllCarriers,
  getCarrierById,
} from '../../../modules/carrier/carrier.service';
import handleError from '@utils/handleError';
import { Carrier } from '@prisma/client';

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

const mockHandleError = handleError as jest.MockedFunction<typeof handleError>;

const mockCarrier: Partial<Carrier> = {
  carrier_id: 'carrier-123',
  dot_number: '12345',
  legal_name: 'Test Carrier',
  safety_rating: 'Satisfactory' as any,
  out_of_service_pct: 10,
  crash_total: 2,
  driver_oos_pct: 5,
  insurance_on_file: true,
  authority_status: 'Active' as any,
  last_inspection_date: '2024-01-15',
  fleet_size: 50,
};

describe('Carrier Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCarrier', () => {
    it('deve retornar carrier existente quando content_hash for igual', async () => {
      const existingCarrier = { ...mockCarrier, content_hash: 'same-hash' };
      (prisma.carrier.findUnique as jest.Mock).mockResolvedValue({
        ...existingCarrier,
        content_hash: 'same-hash',
      });

      const result = await createCarrier(mockCarrier as Carrier, 'same-hash');

      expect(prisma.carrier.findUnique).toHaveBeenCalledWith({
        where: { carrier_id: mockCarrier.carrier_id },
        select: expect.any(Object),
      });
      expect(prisma.carrier.upsert).not.toHaveBeenCalled();
      expect(result).toEqual(existingCarrier);
    });

    it('deve criar/atualizar carrier quando content_hash for diferente', async () => {
      const createdCarrier = { ...mockCarrier, score: 85 };
      (prisma.carrier.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.carrier.upsert as jest.Mock).mockResolvedValue(createdCarrier);
      (prisma.carrierScoreHistory.create as jest.Mock).mockResolvedValue({});

      const result = await createCarrier(mockCarrier as Carrier, 'new-hash');

      expect(prisma.carrier.upsert).toHaveBeenCalled();
      expect(prisma.carrierScoreHistory.create).toHaveBeenCalled();
      expect(result).toEqual(createdCarrier);
    });

    it('deve chamar handleError quando ocorrer erro', async () => {
      const prismaError = { code: 'P2002' };
      (prisma.carrier.findUnique as jest.Mock).mockRejectedValue(prismaError);

      const result = await createCarrier(mockCarrier as Carrier, 'hash');

      expect(mockHandleError).toHaveBeenCalledWith(prismaError);
      expect(result).toBeUndefined();
    });
  });

  describe('getCarrierHistory', () => {
    it('deve retornar histórico de scores do carrier', async () => {
      const mockHistory = [
        { score: 85, recorded_at: new Date() },
        { score: 80, recorded_at: new Date() },
      ];
      (prisma.carrierScoreHistory.findMany as jest.Mock).mockResolvedValue(mockHistory);

      const result = await getCarrierHistory('carrier-123');

      expect(prisma.carrierScoreHistory.findMany).toHaveBeenCalledWith({
        where: { carrier_id: 'carrier-123' },
        orderBy: { recorded_at: 'desc' },
        select: { score: true, recorded_at: true },
      });
      expect(result).toEqual(mockHistory);
    });

    it('deve chamar handleError quando ocorrer erro', async () => {
      const prismaError = { code: 'P1001' };
      (prisma.carrierScoreHistory.findMany as jest.Mock).mockRejectedValue(prismaError);

      const result = await getCarrierHistory('carrier-123');

      expect(mockHandleError).toHaveBeenCalledWith(prismaError);
      expect(result).toBeUndefined();
    });
  });

  describe('getAllCarriers', () => {
    it('deve retornar todos os carriers', async () => {
      const mockCarriers = [mockCarrier];
      (prisma.carrier.findMany as jest.Mock).mockResolvedValue(mockCarriers);

      const result = await getAllCarriers();

      expect(prisma.carrier.findMany).toHaveBeenCalledWith({
        select: expect.any(Object),
      });
      expect(result).toEqual(mockCarriers);
    });

    it('deve chamar handleError quando ocorrer erro', async () => {
      const prismaError = { code: 'P1001' };
      (prisma.carrier.findMany as jest.Mock).mockRejectedValue(prismaError);

      const result = await getAllCarriers();

      expect(mockHandleError).toHaveBeenCalledWith(prismaError);
      expect(result).toBeUndefined();
    });
  });

  describe('getCarrierById', () => {
    it('deve retornar carrier por id', async () => {
      (prisma.carrier.findUnique as jest.Mock).mockResolvedValue(mockCarrier);

      const result = await getCarrierById('carrier-123');

      expect(prisma.carrier.findUnique).toHaveBeenCalledWith({
        where: { carrier_id: 'carrier-123' },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockCarrier);
    });

    it('deve chamar handleError quando ocorrer erro', async () => {
      const prismaError = { code: 'P2025' };
      (prisma.carrier.findUnique as jest.Mock).mockRejectedValue(prismaError);

      const result = await getCarrierById('carrier-123');

      expect(mockHandleError).toHaveBeenCalledWith(prismaError);
      expect(result).toBeUndefined();
    });
  });
});
