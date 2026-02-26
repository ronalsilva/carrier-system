var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUser } from '../../../modules/login/login.service';
import handleError from '@utils/handleError';
jest.mock('@utils/dbConnection', () => {
    const mockUser = {
        findUnique: jest.fn(),
    };
    return {
        __esModule: true,
        default: {
            user: mockUser,
        },
    };
});
jest.mock('@utils/handleError');
import prisma from '@utils/dbConnection';
const mockHandleError = handleError;
describe('Login Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getUser', () => {
        it('deve retornar usuário quando encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id-123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'test@example.com',
                password: 'hashed-password',
                salt: 'salt-value',
                role: 'user',
                terms_of_service: false,
                created_at: new Date(),
            };
            prisma.user.findUnique.mockResolvedValue(mockUser);
            const result = yield getUser('test@example.com');
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
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
                },
            });
            expect(result).toEqual(mockUser);
            expect(mockHandleError).not.toHaveBeenCalled();
        }));
        it('deve retornar undefined quando ocorrer erro', () => __awaiter(void 0, void 0, void 0, function* () {
            const prismaError = { code: 'P1001', message: 'Conexão falhou' };
            prisma.user.findUnique.mockRejectedValue(prismaError);
            const result = yield getUser('test@example.com');
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
    });
});
//# sourceMappingURL=login.service.test.js.map