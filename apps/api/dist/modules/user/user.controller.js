var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createUser, getUser, getUserById, updateUser, deleteUser } from "./user.service";
export function createUserController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.body;
        const userData = yield createUser(user);
        return response.send(userData);
    });
}
export function getUserController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const decoded_data = yield request.jwtVerify();
        const user = yield getUserById(decoded_data.id);
        return response.send(user);
    });
}
export function updateUserController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const decoded_data = yield request.jwtVerify();
        const user = yield getUser(decoded_data.email);
        if (!user) {
            return response.code(404).send({ error: "NOT_FOUND", message: "User not found" });
        }
        const userData = yield updateUser(user.email, request.body);
        return response.send(userData);
    });
}
export function deleteUserController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const decoded_data = yield request.jwtVerify();
        const user = yield getUser(decoded_data.email);
        if (!user) {
            return response.code(404).send({ error: "NOT_FOUND", message: "User not found" });
        }
        const userData = yield deleteUser(user.email);
        return response.send(userData);
    });
}
//# sourceMappingURL=user.controller.js.map