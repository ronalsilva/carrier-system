import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "@prisma/client";
import { createUser, getUser, getUserById, updateUser, deleteUser } from "./user.service";

export async function createUserController(request: FastifyRequest<{ Body: User }>, response: FastifyReply): Promise<FastifyReply> {
    const user = request.body;
    const userData = await createUser(user);
    return response.send(userData);
}

export async function getUserController(request: FastifyRequest, response: FastifyReply): Promise<FastifyReply> {
    const decoded_data = await request.jwtVerify<{ id: string }>();
    const user = await getUserById(decoded_data.id);
    return response.send(user);
}

export async function updateUserController(request: FastifyRequest<{ Body: User }>, response: FastifyReply): Promise<FastifyReply> {
    const decoded_data = await request.jwtVerify<{ email: string }>();
    const user = await getUser(decoded_data.email) as unknown as User;
    if (!user) {
        return response.code(404).send({ error: "NOT_FOUND", message: "User not found" });
    }
    const userData = await updateUser(user.email, request.body as Partial<User>); 
    return response.send(userData);
}

export async function deleteUserController(request: FastifyRequest, response: FastifyReply): Promise<FastifyReply> {
    const decoded_data = await request.jwtVerify<{ email: string }>();
    const user = await getUser(decoded_data.email) as unknown as User;
    if (!user) {
        return response.code(404).send({ error: "NOT_FOUND", message: "User not found" });
    }
    const userData = await deleteUser(user.email);
    return response.send(userData);
}