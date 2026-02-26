import { ErrorDeafult } from "@utils/schemaDeafault";
const baseTag = {
    tags: ['Carrier']
};
export const createCarrierSchema = Object.assign(Object.assign({}, baseTag), { summary: 'Create a carrier', security: [{ bearerAuth: [] }], body: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                carrier_id: { type: 'string', description: 'Carrier ID' },
                dot_number: { type: 'string', minLength: 2 },
                legal_name: { type: 'string', minLength: 2 },
                safety_rating: { type: 'string', enum: ['Satisfactory', 'Conditional', 'Unsatisfactory'] },
                out_of_service_pct: { type: 'number', minimum: 0, maximum: 100 },
                crash_total: { type: 'number', minimum: 0 },
                driver_oos_pct: { type: 'number', minimum: 0, maximum: 100 },
                insurance_on_file: { type: 'boolean', default: false },
                authority_status: { type: 'string', enum: ['Active', 'Inactive', 'Revoked'] },
                last_inspection_date: { type: 'string', format: 'date' },
                fleet_size: { type: 'number', minimum: 0 }
            }
        }
    }, response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    carrier_id: { type: 'string' },
                    dot_number: { type: 'string' },
                    legal_name: { type: 'string' },
                    safety_rating: { type: 'string' },
                    out_of_service_pct: { type: 'number' },
                    crash_total: { type: 'number' },
                    driver_oos_pct: { type: 'number' },
                    insurance_on_file: { type: 'boolean' },
                    authority_status: { type: 'string' },
                    last_inspection_date: { type: 'string' },
                    fleet_size: { type: 'number' },
                    score: { type: 'number' },
                    created_at: { type: 'string' }
                }
            }
        },
        404: ErrorDeafult,
        400: ErrorDeafult,
        500: {
            type: 'object',
            properties: {
                code: { type: "string" },
                mensage: { type: "string" },
            }
        },
    } });
export const getCarrierHistorySchema = Object.assign(Object.assign({}, baseTag), { summary: 'Get carrier score history', description: 'Returns the history of scores for a carrier, ordered by most recent first', security: [{ bearerAuth: [] }], params: {
        type: 'object',
        properties: {
            carrier_id: { type: 'string', description: 'Carrier ID' },
        }
    }, response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    score: { type: 'number', description: 'Carrier score (0-100)' },
                    recorded_at: { type: 'string', format: 'date-time', description: 'When the score was recorded' },
                }
            }
        },
        404: ErrorDeafult,
        400: ErrorDeafult,
        500: {
            type: 'object',
            properties: {
                code: { type: "string" },
                mensage: { type: "string" },
            }
        },
    } });
export const getAllCarriersSchema = Object.assign(Object.assign({}, baseTag), { summary: 'Get all carriers', security: [{ bearerAuth: [] }], response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    carrier_id: { type: 'string' },
                    dot_number: { type: 'string' },
                    legal_name: { type: 'string' },
                    safety_rating: { type: 'string' },
                    out_of_service_pct: { type: 'number' },
                    crash_total: { type: 'number' },
                    driver_oos_pct: { type: 'number' },
                    insurance_on_file: { type: 'boolean' },
                    authority_status: { type: 'string' },
                    last_inspection_date: { type: 'string' },
                    fleet_size: { type: 'number' },
                    score: { type: 'number' },
                    created_at: { type: 'string' }
                }
            }
        },
        404: ErrorDeafult,
        400: ErrorDeafult,
        500: {
            type: 'object',
            properties: {
                code: { type: "string" },
                mensage: { type: "string" },
            }
        },
    } });
export const getCarrierSchema = Object.assign(Object.assign({}, baseTag), { summary: 'Get a carrier', security: [{ bearerAuth: [] }], params: {
        type: 'object',
        properties: {
            carrier_id: { type: 'string', description: 'Carrier ID' },
        }
    }, response: {
        200: {
            type: 'object',
            properties: {
                carrier_id: { type: 'string' },
                dot_number: { type: 'string' },
                legal_name: { type: 'string' },
                safety_rating: { type: 'string' },
                out_of_service_pct: { type: 'number' },
                crash_total: { type: 'number' },
                driver_oos_pct: { type: 'number' },
                insurance_on_file: { type: 'boolean' },
                authority_status: { type: 'string' },
                last_inspection_date: { type: 'string' },
                fleet_size: { type: 'number' },
                score: { type: 'number' },
                created_at: { type: 'string' }
            }
        },
        404: ErrorDeafult,
        400: ErrorDeafult,
        500: {
            type: 'object',
            properties: {
                code: { type: "string" },
                mensage: { type: "string" },
            }
        },
    } });
//# sourceMappingURL=carrier.schemas.js.map