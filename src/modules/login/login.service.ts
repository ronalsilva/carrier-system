import { User } from "@prisma/client";
import prisma from "@utils/dbConnection";
import handleError from "@utils/handleError";

export async function getUser(email: string): Promise<User | void> {
    try {
        const result = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
                terms_of_service: true,
                phone: true,
                salt: true,
                password: true,
                created_at: true,
            }
        });
        return result as unknown as User;
    } catch (err: any) {
        handleError(err);
    }
}