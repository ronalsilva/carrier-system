export const swaggerOptions = {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Carriers - Swagger',
            description: 'Carriers API - Create by Ronald Junger',
            version: '0.0.1'
        },
        servers: [
            {
                url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3002',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        }
    }
};
//# sourceMappingURL=swaggerConfig.js.map