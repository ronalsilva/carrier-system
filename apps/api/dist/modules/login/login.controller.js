var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUser } from "./login.service";
import { verifyPassword } from "@utils/hash";
export function loginController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email: userEmail, password } = request.body;
        const user = yield getUser(userEmail);
        if (!user) {
            return response.code(401).send({
                error: "UNAUTHORIZED",
                message: "User not found"
            });
        }
        if (!verifyPassword({
            candidatePassword: password,
            salt: user.salt,
            hash: user.password,
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
    });
}
//# sourceMappingURL=login.controller.js.map