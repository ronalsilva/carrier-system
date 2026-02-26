import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import * as fs from "fs";
import env from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fastify, { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fjwt, { JWT } from "@fastify/jwt";
import { swaggerOptions } from "./utils/swaggerConfig";

env.config({ override: false });

declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT;
    }
	export interface FastifyInstance {
		authenticate: any;
	}
}

export default async function buildServer(): Promise<FastifyInstance> {
    const server = fastify();
    await server.register(cors, {
        origin: "*",
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Accept",
            "Content-Type",
            "Authorization",
        ],
        methods: ["GET", "PUT", "POST", "DELETE"],
    })
    await server.register(fastifySwagger, swaggerOptions);
    await server.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: false,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
    })
    await server.register(fjwt, {
		secret: process.env.JWT_SECRET || "",
	});
    server.addHook("preHandler", (req, reply, next) => {
		req.jwt = server.jwt as JWT;
		next();
	});
    server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.code(401).send({ error: "Unauthorized", message: "Invalid or expired token" });
        }
    });

    const modulesPath = path.join(__dirname, "modules");
	const modules = fs.readdirSync(modulesPath);

    // Essa parte foi gerado por IA - Nao queria perder tempo com isso na parte de setup do servidor
    for (const module of modules) {
		const modulePath = path.join(modulesPath, module);
		const stats = fs.statSync(modulePath);
		
		if (!stats.isDirectory()) {
			continue;
		}
		
		const ext = path.extname(fileURLToPath(import.meta.url));
		const routesFileName = `${module}.routes${ext}`;
		const routesFilePath = path.join(modulePath, routesFileName);
	
		if (!fs.existsSync(routesFilePath)) {
			console.warn(`Warning: ${routesFileName} not found in ${module} module`);
			continue;
		}
		
		try {
			const moduleRoutes = await import(pathToFileURL(routesFilePath).href);
			const routes: FastifyPluginAsync = moduleRoutes?.default;
			
			if (!routes) {
				console.warn(`Warning: ${module}: No default export found in ${routesFileName}`);
				continue;
			}
			
			await server.register(routes, { prefix: `api/${module.toLowerCase()}` });
		} catch (error) {
			console.error(`Error loading ${module} module:`, error);
		}
	}

    return server;
}