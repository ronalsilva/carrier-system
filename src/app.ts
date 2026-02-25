import buildServer from "./server";
import { FastifyInstance } from "fastify";

const PORT = Number(process.env.PORT) || 3002;

async function startServer(server: FastifyInstance): Promise<void> {
    try {
        await server.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server ready at http://localhost:${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    } catch (error: any) {
        if (error?.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use.`);
        } else {
            console.error("Error starting server:", error);
        }
        process.exit(1);
    }
}

async function main() {
    const server = await buildServer();
    await startServer(server);

    const shutdown = async () => {
        console.log('Shutting down gracefully...');
        await server.close();
        process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

main();