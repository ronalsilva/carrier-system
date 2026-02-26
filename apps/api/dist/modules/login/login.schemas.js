const baseTag = {
    tags: ['Login']
};
export const loginSchema = Object.assign(Object.assign({}, baseTag), { summary: 'Login de acesso', body: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                minLength: 5,
                maxLength: 255
            },
            password: {
                type: 'string',
                minLength: 4,
                maxLength: 64
            },
        },
        required: ['email', 'password'],
        additionalProperties: false
    }, response: {
        200: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                user_properties: { type: 'array', items: { type: 'object', properties: {
                            id: { type: 'string' },
                            property_id: { type: 'string' },
                            property: { type: 'object', properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    property_type: { type: 'string' },
                                    brand: { type: 'string' },
                                    is_prosumer: { type: 'boolean' },
                                    monthly_cost: { type: 'number' },
                                    has_energy_green_contract: { type: 'boolean' },
                                    electrical_panel_capacity: { type: 'number' },
                                    tension: { type: 'string' },
                                    environment_quantity: { type: 'number' },
                                    wifi_quality: { type: 'string' },
                                    air_conditioning_type: { type: 'string' },
                                    city: { type: 'string' },
                                    building_picture: { type: 'string' },
                                    created_at: { type: 'string' }
                                } }
                        } } },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
            }
        },
    } });
//# sourceMappingURL=login.schemas.js.map