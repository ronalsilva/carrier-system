import { User } from "@prisma/client";
import prisma from "@utils/dbConnection";
import handleError from "@utils/handleError";
import { hashPassword } from "@utils/hash";

export async function createUser(user: User): Promise<User | void> {
    const { hash, salt } = hashPassword(user.password);
    const userData = { ...user, password: hash, salt };

    try {
        const result = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                terms_of_service: true,
                phone: true,
                created_at: true
            }
        });
        return result as User;
    } catch (err: any) {
        handleError(err);
    }
}

export async function getUser(email: string): Promise<User | void> {
    try {
        const result = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                terms_of_service: true,
                phone: true,
                created_at: true,
            }
        });
        return result as unknown as User;
    } catch (err: any) {
        handleError(err);
    }
}

export async function updateUser(email: string, user: Partial<User>): Promise<User | void> {
    try {
        const result = await prisma.user.update({
            where: { email },
            data: user,
            select: {
                first_name: true,
                last_name: true,
                email: true,
                terms_of_service: true,
                phone: true,
                created_at: true
            }
        });
        return result as User;
    } catch (err: any) {
        handleError(err);
    }
}

export async function deleteUser(email: string): Promise<void> {
    try {
        await prisma.user.delete({ where: { email } });
    } catch (err: any) {
        handleError(err);
        throw new Error("Error deleting user");
    }
}

export async function getUserById(userId: string): Promise<User | null> {
    try {
        const result = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                terms_of_service: true,
                phone: true,
                created_at: true
            }
        });
        return result as User | null;
    } catch (err: any) {
        console.error('Error getting user by ID:', err);
        throw new Error("Error getting user by ID");
    }
}