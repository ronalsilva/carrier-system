var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createUserController, getUserController, updateUserController, deleteUserController, } from '@modules/user/user.controller';
import { createUser, getUser, getUserById, updateUser, deleteUser } from '@modules/user/user.service';
jest.mock('@modules/user/user.service');
const mockCreateUser = createUser;
const mockGetUser = getUser;
const mockGetUserById = getUserById;
const mockUpdateUser = updateUser;
const mockDeleteUser = deleteUser;
describe('User Controller', () => {
    let mockRequest;
    let mockReply;
    let mockJwtVerify;
    beforeEach(() => {
        jest.clearAllMocks();
        mockJwtVerify = jest.fn().mockResolvedValue({ email: 'test@example.com' });
        mockRequest = {
            body: {},
            jwtVerify: mockJwtVerify,
        };
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });
    describe('createUserController', () => {
        it('deve criar um usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = {
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
            mockRequest.body = mockUserData;
            mockCreateUser.mockResolvedValue(mockCreatedUser);
            yield createUserController(mockRequest, mockReply);
            expect(mockCreateUser).toHaveBeenCalledWith(mockUserData);
            expect(mockReply.send).toHaveBeenCalledWith(mockCreatedUser);
            expect(mockReply.code).not.toHaveBeenCalled();
        }));
        it('deve retornar undefined quando o service retornar undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = {
                email: 'john@example.com',
                password: 'password123',
            };
            mockRequest.body = mockUserData;
            mockCreateUser.mockResolvedValue(undefined);
            yield createUserController(mockRequest, mockReply);
            expect(mockCreateUser).toHaveBeenCalledWith(mockUserData);
            expect(mockReply.send).toHaveBeenCalledWith(undefined);
        }));
        it('deve passar os dados corretos do body para o service', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = {
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane@example.com',
                password: 'securepassword',
                terms_of_service: true,
            };
            const mockCreatedUser = {
                id: 'user-id-456',
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane@example.com',
                terms_of_service: true,
                phone: null,
                created_at: new Date(),
            };
            mockRequest.body = mockUserData;
            mockCreateUser.mockResolvedValue(mockCreatedUser);
            yield createUserController(mockRequest, mockReply);
            expect(mockCreateUser).toHaveBeenCalledWith(mockUserData);
            expect(mockReply.send).toHaveBeenCalledWith(mockCreatedUser);
        }));
    });
    describe('getUserController', () => {
        it('deve retornar o usuário quando o JWT for válido', () => __awaiter(void 0, void 0, void 0, function* () {
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
            mockJwtVerify.mockResolvedValue({ id: 'user-id-123' });
            mockGetUserById.mockResolvedValue(mockUser);
            yield getUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith('user-id-123');
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
            expect(mockReply.code).not.toHaveBeenCalled();
        }));
        it('deve lançar erro quando o JWT for inválido', () => __awaiter(void 0, void 0, void 0, function* () {
            const jwtError = new Error('Invalid token');
            mockJwtVerify.mockRejectedValue(jwtError);
            yield expect(getUserController(mockRequest, mockReply)).rejects.toThrow('Invalid token');
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUserById).not.toHaveBeenCalled();
            expect(mockReply.send).not.toHaveBeenCalled();
        }));
        it('deve usar o id do JWT decodificado para buscar o usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id-789',
                email: 'different@example.com',
                first_name: 'Different',
                last_name: 'User',
            };
            mockJwtVerify.mockResolvedValue({ id: 'user-id-789' });
            mockGetUserById.mockResolvedValue(mockUser);
            yield getUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith('user-id-789');
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
        }));
    });
    describe('updateUserController', () => {
        it('deve atualizar o usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                first_name: 'John',
                last_name: 'Doe',
            };
            const updateData = {
                first_name: 'Jane',
                last_name: 'Smith',
            };
            const updatedUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                first_name: 'Jane',
                last_name: 'Smith',
                terms_of_service: false,
                phone: null,
                created_at: new Date(),
            };
            mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
            mockGetUser.mockResolvedValue(existingUser);
            mockUpdateUser.mockResolvedValue(updatedUser);
            mockRequest.body = updateData;
            yield updateUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockUpdateUser).toHaveBeenCalledWith('test@example.com', updateData);
            expect(mockReply.send).toHaveBeenCalledWith(updatedUser);
            expect(mockReply.code).not.toHaveBeenCalled();
        }));
        it('deve retornar erro 404 quando o usuário não for encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
            mockGetUser.mockResolvedValue(undefined);
            mockRequest.body = { first_name: 'Jane' };
            yield updateUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockUpdateUser).not.toHaveBeenCalled();
            expect(mockReply.code).toHaveBeenCalledWith(404);
            expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
        }));
        it('deve retornar erro 404 quando o usuário for null', () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
            mockGetUser.mockResolvedValue(null);
            mockRequest.body = { first_name: 'Jane' };
            yield updateUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockUpdateUser).not.toHaveBeenCalled();
            expect(mockReply.code).toHaveBeenCalledWith(404);
            expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
        }));
        it('deve lançar erro quando o JWT for inválido', () => __awaiter(void 0, void 0, void 0, function* () {
            const jwtError = new Error('Invalid token');
            mockJwtVerify.mockRejectedValue(jwtError);
            mockRequest.body = { first_name: 'Jane' };
            yield expect(updateUserController(mockRequest, mockReply)).rejects.toThrow('Invalid token');
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).not.toHaveBeenCalled();
            expect(mockUpdateUser).not.toHaveBeenCalled();
        }));
        it('deve usar os dados do body para atualizar o usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = {
                id: 'user-id-123',
                email: 'test@example.com',
            };
            const updateData = {
                first_name: 'Updated',
                last_name: 'Name',
                phone: '1234567890',
            };
            const updatedUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                first_name: 'Updated',
                last_name: 'Name',
                phone: '1234567890',
                terms_of_service: false,
                created_at: new Date(),
            };
            mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
            mockGetUser.mockResolvedValue(existingUser);
            mockUpdateUser.mockResolvedValue(updatedUser);
            mockRequest.body = updateData;
            yield updateUserController(mockRequest, mockReply);
            expect(mockUpdateUser).toHaveBeenCalledWith('test@example.com', updateData);
            expect(mockReply.send).toHaveBeenCalledWith(updatedUser);
        }));
    });
    describe('deleteUserController', () => {
        it('deve deletar o usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                first_name: 'John',
                last_name: 'Doe',
            };
            mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
            mockGetUser.mockResolvedValue(existingUser);
            mockDeleteUser.mockResolvedValue(undefined);
            yield deleteUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockDeleteUser).toHaveBeenCalledWith('test@example.com');
            expect(mockReply.send).toHaveBeenCalledWith(undefined);
            expect(mockReply.code).not.toHaveBeenCalled();
        }));
        it('deve retornar erro 404 quando o usuário não for encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
            mockGetUser.mockResolvedValue(undefined);
            yield deleteUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockDeleteUser).not.toHaveBeenCalled();
            expect(mockReply.code).toHaveBeenCalledWith(404);
            expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
        }));
        it('deve retornar erro 404 quando o usuário for null', () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
            mockGetUser.mockResolvedValue(null);
            yield deleteUserController(mockRequest, mockReply);
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockDeleteUser).not.toHaveBeenCalled();
            expect(mockReply.code).toHaveBeenCalledWith(404);
            expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
        }));
        it('deve lançar erro quando o JWT for inválido', () => __awaiter(void 0, void 0, void 0, function* () {
            const jwtError = new Error('Invalid token');
            mockJwtVerify.mockRejectedValue(jwtError);
            yield expect(deleteUserController(mockRequest, mockReply)).rejects.toThrow('Invalid token');
            expect(mockJwtVerify).toHaveBeenCalled();
            expect(mockGetUser).not.toHaveBeenCalled();
            expect(mockDeleteUser).not.toHaveBeenCalled();
        }));
        it('deve usar o email do usuário encontrado para deletar', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = {
                id: 'user-id-456',
                email: 'different@example.com',
                first_name: 'Different',
                last_name: 'User',
            };
            mockJwtVerify.mockResolvedValue({ email: 'different@example.com' });
            mockGetUser.mockResolvedValue(existingUser);
            mockDeleteUser.mockResolvedValue(undefined);
            yield deleteUserController(mockRequest, mockReply);
            expect(mockDeleteUser).toHaveBeenCalledWith('different@example.com');
            expect(mockReply.send).toHaveBeenCalledWith(undefined);
        }));
    });
});
//# sourceMappingURL=user.controller.test.js.map