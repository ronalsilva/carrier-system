var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "@utils/dbConnection";
import handleError from "@utils/handleError";
import { hashPassword } from "@utils/hash";
export function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { hash, salt } = hashPassword(user.password);
        const userData = Object.assign(Object.assign({}, user), { password: hash, salt });
        try {
            const result = yield prisma.user.create({
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
            return result;
        }
        catch (err) {
            handleError(err);
        }
    });
}
export function getUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.user.findUnique({
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
            return result;
        }
        catch (err) {
            handleError(err);
        }
    });
}
export function updateUser(email, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.user.update({
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
            return result;
        }
        catch (err) {
            handleError(err);
        }
    });
}
export function deleteUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.user.delete({ where: { email } });
        }
        catch (err) {
            handleError(err);
            throw new Error("Error deleting user");
        }
    });
}
export function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.user.findUnique({
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
            return result;
        }
        catch (err) {
            console.error('Error getting user by ID:', err);
            throw new Error("Error getting user by ID");
        }
    });
}
//# sourceMappingURL=user.service.js.map