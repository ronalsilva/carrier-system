import {
  createCarrierController,
  getCarrierHistoryController,
  getAllCarriersController,
  getCarrierController,
} from '../../../modules/carrier/carrier.controller';
import {
  createCarrier,
  getCarrierHistory,
  getAllCarriers,
  getCarrierById,
} from '../../../modules/carrier/carrier.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Carrier } from '@prisma/client';

jest.mock('@modules/carrier/carrier.service');

const mockCreateCarrier = createCarrier as jest.MockedFunction<typeof createCarrier>;
const mockGetCarrierHistory = getCarrierHistory as jest.MockedFunction<typeof getCarrierHistory>;
const mockGetAllCarriers = getAllCarriers as jest.MockedFunction<typeof getAllCarriers>;
const mockGetCarrierById = getCarrierById as jest.MockedFunction<typeof getCarrierById>;

describe('Carrier Controller', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('createCarrierController', () => {
    it('deve criar carriers e retornar array de criados', async () => {
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
      const createdCarrier = { ...carriers[0], score: 85 };
      mockRequest.body = carriers;
      mockCreateCarrier.mockResolvedValue(createdCarrier as Carrier);

      await createCarrierController(
        mockRequest as FastifyRequest<{ Body: Carrier }>,
        mockReply as FastifyReply
      );

      expect(mockCreateCarrier).toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalledWith([createdCarrier]);
    });

    it('deve processar múltiplos carriers', async () => {
      const carriers = [
        { carrier_id: 'c1', dot_number: '1', legal_name: 'C1', safety_rating: 'Satisfactory', out_of_service_pct: 0, crash_total: 0, driver_oos_pct: 0, insurance_on_file: true, authority_status: 'Active', last_inspection_date: '2024-01-01', fleet_size: 10 },
        { carrier_id: 'c2', dot_number: '2', legal_name: 'C2', safety_rating: 'Conditional', out_of_service_pct: 20, crash_total: 1, driver_oos_pct: 10, insurance_on_file: false, authority_status: 'Inactive', last_inspection_date: '2024-01-02', fleet_size: 20 },
      ];
      mockRequest.body = carriers;
      mockCreateCarrier
        .mockResolvedValueOnce({ carrier_id: 'c1', score: 90 } as Carrier)
        .mockResolvedValueOnce({ carrier_id: 'c2', score: 60 } as Carrier);

      await createCarrierController(
        mockRequest as FastifyRequest<{ Body: Carrier }>,
        mockReply as FastifyReply
      );

      expect(mockCreateCarrier).toHaveBeenCalledTimes(2);
      expect(mockReply.send).toHaveBeenCalledWith([
        { carrier_id: 'c1', score: 90 },
        { carrier_id: 'c2', score: 60 },
      ]);
    });

    it('deve ignorar carriers que retornam undefined', async () => {
      const carriers = [
        { carrier_id: 'c1', dot_number: '1', legal_name: 'C1', safety_rating: 'Satisfactory', out_of_service_pct: 0, crash_total: 0, driver_oos_pct: 0, insurance_on_file: true, authority_status: 'Active', last_inspection_date: '2024-01-01', fleet_size: 10 },
      ];
      mockRequest.body = carriers;
      mockCreateCarrier.mockResolvedValue(undefined);

      await createCarrierController(
        mockRequest as FastifyRequest<{ Body: Carrier }>,
        mockReply as FastifyReply
      );

      expect(mockReply.send).toHaveBeenCalledWith([]);
    });
  });

  describe('getCarrierHistoryController', () => {
    it('deve retornar histórico do carrier', async () => {
      const mockHistory = [
        { score: 85, recorded_at: new Date() },
        { score: 80, recorded_at: new Date() },
      ];
      mockRequest.params = { carrier_id: 'carrier-123' };
      mockGetCarrierHistory.mockResolvedValue(mockHistory as any);

      await getCarrierHistoryController(
        mockRequest as FastifyRequest<{ Params: { carrier_id: string } }>,
        mockReply as FastifyReply
      );

      expect(mockGetCarrierHistory).toHaveBeenCalledWith('carrier-123');
      expect(mockReply.send).toHaveBeenCalledWith(mockHistory);
    });
  });

  describe('getAllCarriersController', () => {
    it('deve retornar todos os carriers', async () => {
      const mockCarriers = [
        { carrier_id: 'c1', legal_name: 'Carrier 1', score: 85 },
      ];
      mockGetAllCarriers.mockResolvedValue(mockCarriers as Carrier[]);

      await getAllCarriersController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockGetAllCarriers).toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalledWith(mockCarriers);
    });
  });

  describe('getCarrierController', () => {
    it('deve retornar carrier por id', async () => {
      const mockCarrier = {
        carrier_id: 'carrier-123',
        legal_name: 'Test Carrier',
        score: 85,
      };
      mockRequest.params = { carrier_id: 'carrier-123' };
      mockGetCarrierById.mockResolvedValue(mockCarrier as Carrier);

      await getCarrierController(
        mockRequest as FastifyRequest<{ Params: { carrier_id: string } }>,
        mockReply as FastifyReply
      );

      expect(mockGetCarrierById).toHaveBeenCalledWith('carrier-123');
      expect(mockReply.send).toHaveBeenCalledWith(mockCarrier);
    });
  });
});
