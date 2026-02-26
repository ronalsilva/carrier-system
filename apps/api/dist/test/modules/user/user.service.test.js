var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createUser, getUser, updateUser, deleteUser } from '@modules/user/user.service';
import handleError from '@utils/handleError';
import { hashPassword } from '@utils/hash';
jest.mock('@utils/dbConnection', () => {
    const mockUser = {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    return {
        __esModule: true,
        default: {
            user: mockUser,
        },
    };
});
jest.mock('@utils/handleError');
jest.mock('@utils/hash');
import prisma from '@utils/dbConnection';
const mockHandleError = handleError;
const mockHashPassword = hashPassword;
describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHashPassword.mockReturnValue({
            hash: 'hashed-password',
            salt: 'salt-value',
        });
    });
    describe('createUser', () => {
        it('deve criar um usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id-123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                terms_of_service: false,
                created_at: new Date(),
            };
            const mockCreatedUser = {
                id: 'user-id-123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                terms_of_service: false,
                phone: null,
                created_at: new Date(),
            };
            prisma.user.create.mockResolvedValue(mockCreatedUser);
            const result = yield createUser(mockUser);
            expect(mockHashPassword).toHaveBeenCalledWith('password123');
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: Object.assign(Object.assign({}, mockUser), { password: 'hashed-password', salt: 'salt-value' }),
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    terms_of_service: true,
                    phone: true,
                    created_at: true,
                },
            });
            expect(result).toEqual(mockCreatedUser);
            expect(mockHandleError).not.toHaveBeenCalled();
        }));
        it('deve chamar handleError quando ocorrer um erro P2002 (email duplicado)', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                email: 'existing@example.com',
                password: 'password123',
            };
            const prismaError = {
                code: 'P2002',
                meta: { target: ['email'] },
            };
            prisma.user.create.mockRejectedValue(prismaError);
            const result = yield createUser(mockUser);
            expect(mockHashPassword).toHaveBeenCalledWith('password123');
            expect(prisma.user.create).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
        it('deve chamar handleError quando ocorrer um erro P2012 (valor obrigatório faltando)', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                email: 'test@example.com',
                password: 'password123',
            };
            const prismaError = {
                code: 'P2012',
                meta: {},
            };
            prisma.user.create.mockRejectedValue(prismaError);
            const result = yield createUser(mockUser);
            expect(mockHashPassword).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
        it('deve chamar handleError quando ocorrer um erro genérico', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                email: 'test@example.com',
                password: 'password123',
            };
            const genericError = {
                code: 'UNKNOWN_ERROR',
                message: 'Erro desconhecido',
            };
            prisma.user.create.mockRejectedValue(genericError);
            const result = yield createUser(mockUser);
            expect(mockHashPassword).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(genericError);
            expect(result).toBeUndefined();
        }));
        it('deve usar o hash e salt gerados pelo hashPassword', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                email: 'test@example.com',
                password: 'password123',
                first_name: 'Test',
                last_name: 'User',
            };
            const mockCreatedUser = {
                id: 'user-id-123',
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                terms_of_service: false,
                phone: null,
                created_at: new Date(),
            };
            mockHashPassword.mockReturnValue({
                hash: 'custom-hash',
                salt: 'custom-salt',
            });
            prisma.user.create.mockResolvedValue(mockCreatedUser);
            yield createUser(mockUser);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: Object.assign(Object.assign({}, mockUser), { password: 'custom-hash', salt: 'custom-salt' }),
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    terms_of_service: true,
                    phone: true,
                    created_at: true,
                },
            });
        }));
    });
    describe('getUser', () => {
        it('deve retornar um usuário quando encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const mockUser = {
                id: 'user-id-123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'test@example.com',
                password: 'hashed-password',
                salt: 'salt-value',
                terms_of_service: false,
                created_at: new Date(),
            };
            prisma.user.findUnique.mockResolvedValue(mockUser);
            const result = yield getUser(email);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    terms_of_service: true,
                    phone: true,
                    created_at: true,
                },
            });
            expect(result).toEqual(mockUser);
            expect(mockHandleError).not.toHaveBeenCalled();
        }));
        it('deve retornar null quando o usuário não for encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'notfound@example.com';
            prisma.user.findUnique.mockResolvedValue(null);
            const result = yield getUser(email);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    terms_of_service: true,
                    phone: true,
                    created_at: true,
                },
            });
            expect(result).toBeNull();
            expect(mockHandleError).not.toHaveBeenCalled();
        }));
        it('deve chamar handleError quando ocorrer um erro de conexão (P1001)', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const prismaError = {
                code: 'P1001',
                message: 'Conexão falhou',
            };
            prisma.user.findUnique.mockRejectedValue(prismaError);
            const result = yield getUser(email);
            expect(prisma.user.findUnique).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
        it('deve chamar handleError quando ocorrer um erro genérico', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const genericError = {
                code: 'UNKNOWN_ERROR',
                message: 'Erro desconhecido',
            };
            prisma.user.findUnique.mockRejectedValue(genericError);
            const result = yield getUser(email);
            expect(prisma.user.findUnique).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(genericError);
            expect(result).toBeUndefined();
        }));
    });
    describe('updateUser', () => {
        it('deve atualizar um usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const updateData = {
                first_name: 'Jane',
                last_name: 'Smith',
                phone: '1234567890',
            };
            const mockUpdatedUser = {
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'test@example.com',
                terms_of_service: false,
                phone: '1234567890',
                created_at: new Date(),
            };
            prisma.user.update.mockResolvedValue(mockUpdatedUser);
            const result = yield updateUser(email, updateData);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { email },
                data: updateData,
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    terms_of_service: true,
                    phone: true,
                    created_at: true,
                },
            });
            expect(result).toEqual(mockUpdatedUser);
            expect(mockHandleError).not.toHaveBeenCalled();
        }));
        it('deve chamar handleError quando o usuário não for encontrado (P2025)', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'notfound@example.com';
            const updateData = {
                first_name: 'Jane',
            };
            const prismaError = {
                code: 'P2025',
                meta: {},
            };
            prisma.user.update.mockRejectedValue(prismaError);
            const result = yield updateUser(email, updateData);
            expect(prisma.user.update).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
        it('deve chamar handleError quando ocorrer um erro P2000 (valor muito longo)', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const updateData = {
                first_name: 'A'.repeat(1000),
            };
            const prismaError = {
                code: 'P2000',
                meta: {},
            };
            prisma.user.update.mockRejectedValue(prismaError);
            const result = yield updateUser(email, updateData);
            expect(prisma.user.update).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
            expect(result).toBeUndefined();
        }));
        it('deve atualizar apenas os campos fornecidos', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const updateData = {
                first_name: 'Updated Name',
            };
            const mockUpdatedUser = {
                first_name: 'Updated Name',
                last_name: 'Doe',
                email: 'test@example.com',
                terms_of_service: false,
                phone: null,
                created_at: new Date(),
            };
            prisma.user.update.mockResolvedValue(mockUpdatedUser);
            yield updateUser(email, updateData);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { email },
                data: updateData,
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    terms_of_service: true,
                    phone: true,
                    created_at: true,
                },
            });
        }));
        it('deve chamar handleError quando ocorrer um erro genérico', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const updateData = {
                first_name: 'Jane',
            };
            const genericError = {
                code: 'UNKNOWN_ERROR',
                message: 'Erro desconhecido',
            };
            prisma.user.update.mockRejectedValue(genericError);
            const result = yield updateUser(email, updateData);
            expect(prisma.user.update).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(genericError);
            expect(result).toBeUndefined();
        }));
    });
    describe('deleteUser', () => {
        it('deve deletar um usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            prisma.user.delete.mockResolvedValue({});
            yield deleteUser(email);
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { email },
            });
            expect(mockHandleError).not.toHaveBeenCalled();
        }));
        it('deve chamar handleError e lançar erro quando o usuário não for encontrado (P2025)', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'notfound@example.com';
            const prismaError = {
                code: 'P2025',
                meta: {},
            };
            prisma.user.delete.mockRejectedValue(prismaError);
            yield expect(deleteUser(email)).rejects.toThrow('Error deleting user');
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { email },
            });
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
        }));
        it('deve chamar handleError e lançar erro quando ocorrer um erro de conexão (P1001)', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const prismaError = {
                code: 'P1001',
                message: 'Conexão falhou',
            };
            prisma.user.delete.mockRejectedValue(prismaError);
            yield expect(deleteUser(email)).rejects.toThrow('Error deleting user');
            expect(prisma.user.delete).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(prismaError);
        }));
        it('deve chamar handleError e lançar erro quando ocorrer um erro genérico', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const genericError = {
                code: 'UNKNOWN_ERROR',
                message: 'Erro desconhecido',
            };
            prisma.user.delete.mockRejectedValue(genericError);
            yield expect(deleteUser(email)).rejects.toThrow('Error deleting user');
            expect(prisma.user.delete).toHaveBeenCalled();
            expect(mockHandleError).toHaveBeenCalledWith(genericError);
        }));
        it('deve sempre lançar erro após chamar handleError', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@example.com';
            const prismaError = {
                code: 'P2003',
                meta: {},
            };
            prisma.user.delete.mockRejectedValue(prismaError);
            yield expect(deleteUser(email)).rejects.toThrow('Error deleting user');
            expect(mockHandleError).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=user.service.test.js.map