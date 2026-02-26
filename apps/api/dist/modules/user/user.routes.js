var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createUserSchema, getUserSchema, updateUserSchema, deleteUserSchema } from "./user.schemas";
import { createUserController, getUserController, updateUserController, deleteUserController } from "./user.controller";
function userRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("", { schema: getUserSchema }, getUserController);
        fastify.post("", { schema: createUserSchema }, createUserController);
        fastify.put("", { schema: updateUserSchema }, updateUserController);
        fastify.delete("", { schema: deleteUserSchema }, deleteUserController);
    });
}
export default userRoutes;
//# sourceMappingURL=user.routes.js.map