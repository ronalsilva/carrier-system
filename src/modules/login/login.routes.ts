import { loginSchema } from "./login.schemas";
import { FastifyInstance } from "fastify";
import { loginController } from "./login.controller";

async function loginRoutes(fastify: FastifyInstance) {
    fastify.post("", { schema: loginSchema }, loginController);
}

export default loginRoutes;