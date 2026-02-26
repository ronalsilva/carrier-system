var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import * as fs from "fs";
import env from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fjwt from "@fastify/jwt";
import { swaggerOptions } from "./utils/swaggerConfig";
env.config({ override: false });
export default function buildServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = fastify();
        yield server.register(cors, {
            origin: "*",
            allowedHeaders: [
                "Origin",
                "X-Requested-With",
                "Accept",
                "Content-Type",
                "Authorization",
            ],
            methods: ["GET", "PUT", "POST", "DELETE"],
        });
        yield server.register(fastifySwagger, swaggerOptions);
        yield server.register(fastifySwaggerUi, {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: 'none',
                deepLinking: false
            },
            uiHooks: {
                onRequest: function (request, reply, next) { next(); },
                preHandler: function (request, reply, next) { next(); }
            },
            staticCSP: false,
            transformStaticCSP: (header) => header,
            transformSpecification: (swaggerObject, request, reply) => { return swaggerObject; },
            transformSpecificationClone: true
        });
        yield server.register(fjwt, {
            secret: process.env.JWT_SECRET || "",
        });
        server.addHook("preHandler", (req, reply, next) => {
            req.jwt = server.jwt;
            next();
        });
        server.decorate("authenticate", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield request.jwtVerify();
            }
            catch (error) {
                reply.code(401).send({ error: "Unauthorized", message: "Invalid or expired token" });
            }
        }));
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
                const moduleRoutes = yield import(pathToFileURL(routesFilePath).href);
                const routes = moduleRoutes === null || moduleRoutes === void 0 ? void 0 : moduleRoutes.default;
                if (!routes) {
                    console.warn(`Warning: ${module}: No default export found in ${routesFileName}`);
                    continue;
                }
                yield server.register(routes, { prefix: `api/${module.toLowerCase()}` });
            }
            catch (error) {
                console.error(`Error loading ${module} module:`, error);
            }
        }
        return server;
    });
}
//# sourceMappingURL=server.js.map