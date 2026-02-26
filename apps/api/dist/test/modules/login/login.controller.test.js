var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loginController } from '@modules/login/login.controller';
import { getUser } from '@modules/login/login.service';
import { verifyPassword } from '@utils/hash';
jest.mock('@modules/login/login.service');
jest.mock('@utils/hash');
const mockGetUser = getUser;
const mockVerifyPassword = verifyPassword;
describe('Login Controller', () => {
    let mockRequest;
    let mockReply;
    let mockJwt;
    beforeEach(() => {
        jest.clearAllMocks();
        mockJwt = {
            sign: jest.fn().mockReturnValue('mock-access-token'),
        };
        mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
            jwt: mockJwt,
        };
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });
    describe('Login bem-sucedido', () => {
        it('deve retornar um token de acesso quando as credenciais estiverem corretas', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id-123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'test@example.com',
                password: 'hashed-password',
                salt: 'salt-value',
                role: 'user',
            };
            mockGetUser.mockResolvedValue(mockUser);
            mockVerifyPassword.mockReturnValue(true);
            yield loginController(mockRequest, mockReply);
            expect(mockGetUser).toHaveBeenCalledTimes(1);
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockVerifyPassword).toHaveBeenCalledWith({
                candidatePassword: 'password123',
                salt: 'salt-value',
                hash: 'hashed-password',
            });
            expect(mockJwt.sign).toHaveBeenCalledWith({
                email: 'test@example.com',
                id: 'user-id-123',
                role: 'user',
                refresh_token: 'salt-value',
            });
            expect(mockReply.send).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'test@example.com',
                role: 'user',
                accessToken: 'mock-access-token',
                refreshToken: 'salt-value',
            });
            expect(mockReply.code).not.toHaveBeenCalled();
        }));
    });
    describe('Erro: Usuário não encontrado', () => {
        it('deve retornar erro 401 quando o usuário não for encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetUser.mockResolvedValue(undefined);
            yield loginController(mockRequest, mockReply);
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockVerifyPassword).not.toHaveBeenCalled();
            expect(mockReply.code).toHaveBeenCalledWith(401);
            expect(mockReply.send).toHaveBeenCalledWith({
                error: 'UNAUTHORIZED',
                message: 'User not found',
            });
            expect(mockJwt.sign).not.toHaveBeenCalled();
        }));
        it('deve retornar erro 401 quando o usuário for null', () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetUser.mockResolvedValue(null);
            yield loginController(mockRequest, mockReply);
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockVerifyPassword).not.toHaveBeenCalled();
            expect(mockReply.code).toHaveBeenCalledWith(401);
            expect(mockReply.send).toHaveBeenCalledWith({
                error: 'UNAUTHORIZED',
                message: 'User not found',
            });
        }));
    });
    describe('Erro: Senha incorreta', () => {
        it('deve retornar erro 401 quando a senha estiver incorreta', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                password: 'hashed-password',
                salt: 'salt-value',
                role: 'user',
            };
            mockGetUser.mockResolvedValue(mockUser);
            mockVerifyPassword.mockReturnValue(false);
            yield loginController(mockRequest, mockReply);
            expect(mockGetUser).toHaveBeenCalledTimes(1);
            expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
            expect(mockVerifyPassword).toHaveBeenCalledWith({
                candidatePassword: 'password123',
                salt: 'salt-value',
                hash: 'hashed-password',
            });
            expect(mockReply.code).toHaveBeenCalledWith(401);
            expect(mockReply.send).toHaveBeenCalledWith({
                error: 'UNAUTHORIZED',
                message: 'Email or password incorrect',
            });
            expect(mockJwt.sign).not.toHaveBeenCalled();
        }));
    });
    describe('Validação de dados', () => {
        it('deve usar o email e senha do body da requisição', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {
                email: 'different@example.com',
                password: 'different-password',
            };
            const mockUser = {
                id: 'user-id-123',
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'different@example.com',
                password: 'hashed-password',
                salt: 'salt-value',
                role: 'user',
            };
            mockGetUser.mockResolvedValue(mockUser);
            mockVerifyPassword.mockReturnValue(true);
            yield loginController(mockRequest, mockReply);
            expect(mockGetUser).toHaveBeenCalledWith('different@example.com');
            expect(mockVerifyPassword).toHaveBeenCalledWith({
                candidatePassword: 'different-password',
                salt: 'salt-value',
                hash: 'hashed-password',
            });
        }));
        it('deve garantir que o token JWT seja gerado com os dados corretos do usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'specific-user-id',
                first_name: 'Specific',
                last_name: 'User',
                email: 'specific@example.com',
                password: 'hashed-password',
                salt: 'specific-salt',
                role: 'admin',
            };
            mockGetUser.mockResolvedValue(mockUser);
            mockVerifyPassword.mockReturnValue(true);
            yield loginController(mockRequest, mockReply);
            expect(mockJwt.sign).toHaveBeenCalledWith({
                email: 'specific@example.com',
                id: 'specific-user-id',
                role: 'admin',
                refresh_token: 'specific-salt',
            });
        }));
    });
    describe('Estrutura de resposta', () => {
        it('deve retornar a estrutura correta de resposta em caso de sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 'user-id-123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'test@example.com',
                password: 'hashed-password',
                salt: 'salt-value',
                role: 'user',
            };
            mockGetUser.mockResolvedValue(mockUser);
            mockVerifyPassword.mockReturnValue(true);
            yield loginController(mockRequest, mockReply);
            const sendCall = mockReply.send.mock.calls[0][0];
            expect(sendCall).toHaveProperty('name');
            expect(sendCall).toHaveProperty('email');
            expect(sendCall).toHaveProperty('role');
            expect(sendCall).toHaveProperty('accessToken');
            expect(sendCall).toHaveProperty('refreshToken');
            expect(typeof sendCall.accessToken).toBe('string');
            expect(typeof sendCall.refreshToken).toBe('string');
            expect(sendCall.name).toBe('John Doe');
            expect(sendCall.email).toBe('test@example.com');
        }));
    });
});
//# sourceMappingURL=login.controller.test.js.map