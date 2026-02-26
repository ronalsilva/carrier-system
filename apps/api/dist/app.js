var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import buildServer from "./server";
const PORT = Number(process.env.PORT) || 3002;
function startServer(server) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield server.listen({ port: PORT, host: '0.0.0.0' });
            console.log(`Server ready at http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.code) === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use.`);
            }
            else {
                console.error("Error starting server:", error);
            }
            process.exit(1);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield buildServer();
        yield startServer(server);
        const shutdown = () => __awaiter(this, void 0, void 0, function* () {
            console.log('Shutting down gracefully...');
            yield server.close();
            process.exit(0);
        });
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    });
}
main();
//# sourceMappingURL=app.js.map