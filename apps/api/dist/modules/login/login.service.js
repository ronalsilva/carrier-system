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
                    role: true,
                    terms_of_service: true,
                    phone: true,
                    salt: true,
                    password: true,
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
//# sourceMappingURL=login.service.js.map