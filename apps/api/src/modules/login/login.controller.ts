import { getUser } from "./login.service";
import { verifyPassword } from "@utils/hash";
import { FastifyRequest, FastifyReply } from "fastify";

export async function loginController(
    request: FastifyRequest<{ Body: { email: string; password: string } }>, 
    response: FastifyReply
): Promise<FastifyReply> {
    const { email: userEmail, password } = request.body;
    const user = await getUser(userEmail);
    if (!user) {
        return response.code(401).send({ 
            error: "UNAUTHORIZED", 
            message: "User not found" 
        });
    }

    if (!verifyPassword({
        candidatePassword: password,
        salt: user.salt as string,
        hash: user.password as string,
    })) {
        return response.code(401).send({ 
            error: "UNAUTHORIZED", 
            message: "Email or password incorrect" 
        });
    }

    const accessToken = request.jwt.sign({
        email: user.email,
        id: user.id,
        role: user.role,
        refresh_token: user.salt,
    });

    return response.send({ 
        name: user.first_name + " " + user.last_name,
        email: user.email,
        role: user.role,
        accessToken, 
        refreshToken: user.salt 
    });
}