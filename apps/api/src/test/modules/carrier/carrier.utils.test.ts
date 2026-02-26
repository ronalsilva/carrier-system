import { computeCarrierHash, calculateCarrierScore } from '../../../modules/carrier/carrier.utils';

describe('Carrier Utils', () => {
  describe('computeCarrierHash', () => {
    it('deve retornar hash SHA-256 determinístico para o mesmo objeto', () => {
      const carrier = {
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

      const hash1 = computeCarrierHash(carrier);
      const hash2 = computeCarrierHash(carrier);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
    });

    it('deve retornar hashes diferentes para objetos diferentes', () => {
      const carrier1 = { dot_number: '111', legal_name: 'Carrier A' };
      const carrier2 = { dot_number: '222', legal_name: 'Carrier B' };

      const hash1 = computeCarrierHash(carrier1);
      const hash2 = computeCarrierHash(carrier2);

      expect(hash1).not.toBe(hash2);
    });

    it('deve ignorar campos que não estão em HASH_FIELDS', () => {
      const carrier = {
        dot_number: '12345',
        legal_name: 'Test',
        carrier_id: 'extra-field',
        unknown_field: 'ignored',
      };

      const hash = computeCarrierHash(carrier);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });
  });

  describe('calculateCarrierScore', () => {
    it('deve retornar score alto para carrier com bons indicadores', () => {
      const carrier = {
        safety_rating: 'Satisfactory',
        out_of_service_pct: 0,
        crash_total: 0,
        driver_oos_pct: 0,
        insurance_on_file: true,
        authority_status: 'Active',
      };

      const score = calculateCarrierScore(carrier);
      expect(score).toBeGreaterThanOrEqual(90);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('deve retornar score baixo para carrier com maus indicadores', () => {
      const carrier = {
        safety_rating: 'Unsatisfactory',
        out_of_service_pct: 100,
        crash_total: 10,
        driver_oos_pct: 100,
        insurance_on_file: false,
        authority_status: 'Revoked',
      };

      const score = calculateCarrierScore(carrier);
      expect(score).toBeLessThanOrEqual(10);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('deve retornar score intermediário para Conditional e Inactive', () => {
      const carrier = {
        safety_rating: 'Conditional',
        out_of_service_pct: 50,
        crash_total: 5,
        driver_oos_pct: 50,
        insurance_on_file: true,
        authority_status: 'Inactive',
      };

      const score = calculateCarrierScore(carrier);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('deve usar 0 para safety_rating e authority_status desconhecidos (fallback)', () => {
      const carrier = {
        safety_rating: 'Unknown',
        out_of_service_pct: 0,
        crash_total: 0,
        driver_oos_pct: 0,
        insurance_on_file: true,
        authority_status: 'Unknown',
      };

      const score = calculateCarrierScore(carrier);
      expect(score).toBe(65);
    });

    it('deve limitar o score entre 0 e 100', () => {
      const carrier = {
        safety_rating: 'Satisfactory',
        out_of_service_pct: 0,
        crash_total: 0,
        driver_oos_pct: 0,
        insurance_on_file: true,
        authority_status: 'Active',
      };

      const score = calculateCarrierScore(carrier);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
