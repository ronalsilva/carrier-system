import { FastifyInstance } from "fastify";
import { createUserSchema, getUserSchema, updateUserSchema, deleteUserSchema } from "./user.schemas"
import { createUserController, getUserController, updateUserController, deleteUserController } from "./user.controller";

async function userRoutes(fastify: FastifyInstance) {
    fastify.get("", { schema: getUserSchema }, getUserController);
    fastify.post("", { schema: createUserSchema }, createUserController);
    fastify.put("", { schema: updateUserSchema }, updateUserController);
    fastify.delete("", { schema: deleteUserSchema }, deleteUserController);
}

export default userRoutes;
