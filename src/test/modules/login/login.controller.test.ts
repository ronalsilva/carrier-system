import { loginController } from '@modules/login/login.controller';
import { getUser } from '@modules/login/login.service';
import { verifyPassword } from '@utils/hash';
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '@prisma/client';

jest.mock('@modules/login/login.service');
jest.mock('@utils/hash');

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>;

describe('Login Controller', () => {
  let mockRequest: Partial<FastifyRequest<{ Body: { email: string; password: string } }>>;
  let mockReply: Partial<FastifyReply>;
  let mockJwt: { sign: jest.Mock };

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
      jwt: mockJwt as any,
    };

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('Login bem-sucedido', () => {
    it('deve retornar um token de acesso quando as credenciais estiverem corretas', async () => {
      const mockUser: Partial<User> = {
        id: 'user-id-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'hashed-password',
        salt: 'salt-value',
        role: 'user' as any,
      };

      mockGetUser.mockResolvedValue(mockUser as User);
      mockVerifyPassword.mockReturnValue(true);

      await loginController(
        mockRequest as FastifyRequest<{ Body: { email: string; password: string } }>,
        mockReply as FastifyReply
      );

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
    });
  });

  describe('Erro: Usuário não encontrado', () => {
    it('deve retornar erro 401 quando o usuário não for encontrado', async () => {
      mockGetUser.mockResolvedValue(undefined as any);

      await loginController(
        mockRequest as FastifyRequest<{ Body: { email: string; password: string } }>,
        mockReply as FastifyReply
      );

      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockVerifyPassword).not.toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'UNAUTHORIZED',
        message: 'User not found',
      });
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('deve retornar erro 401 quando o usuário for null', async () => {
      mockGetUser.mockResolvedValue(null as any);

      await loginController(
        mockRequest as FastifyRequest<{ Body: { email: string; password: string } }>,
        mockReply as FastifyReply
      );

      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockVerifyPassword).not.toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'UNAUTHORIZED',
        message: 'User not found',
      });
    });
  });

  describe('Erro: Senha incorreta', () => {
    it('deve retornar erro 401 quando a senha estiver incorreta', async () => {
      const mockUser: Partial<User> = {
        id: 'user-id-123',
        email: 'test@example.com',
        password: 'hashed-password',
        salt: 'salt-value',
        role: 'user' as any,
      };

      mockGetUser.mockResolvedValue(mockUser as User);
      mockVerifyPassword.mockReturnValue(false);

      await loginController(
        mockRequest as FastifyRequest<{ Body: { email: string; password: string } }>,
        mockReply as FastifyReply
      );

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
    });
  });

  describe('Validação de dados', () => {
    it('deve usar o email e senha do body da requisição', async () => {
      mockRequest.body = {
        email: 'different@example.com',
        password: 'different-password',
      };

      const mockUser: Partial<User> = {
        id: 'user-id-123',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'different@example.com',
        password: 'hashed-password',
        salt: 'salt-value',
        role: 'user' as any,
      };

      mockGetUser.mockResolvedValue(mockUser as User);
      mockVerifyPassword.mockReturnValue(true);

      await loginController(
        mockRequest as FastifyRequest<{ Body: { email: string; password: string } }>,
        mockReply as FastifyReply
      );

      expect(mockGetUser).toHaveBeenCalledWith('different@example.com');
      expect(mockVerifyPassword).toHaveBeenCalledWith({
        candidatePassword: 'different-password',
        salt: 'salt-value',
        hash: 'hashed-password',
      });
    });

    it('deve garantir que o token JWT seja gerado com os dados corretos do usuário', async () => {
      const mockUser: Partial<User> = {
        id: 'specific-user-id',
        first_name: 'Specific',
        last_name: 'User',
        email: 'specific@example.com',
        password: 'hashed-password',
        salt: 'specific-salt',
        role: 'admin' as any,
      };

      mockGetUser.mockResolvedValue(mockUser as User);
      mockVerifyPassword.mockReturnValue(true);

      await loginController(
        mockRequest as FastifyRequest<{ Body: { email: string; password: string } }>,
        mockReply as FastifyReply
      );

      expect(mockJwt.sign).toHaveBeenCalledWith({
        email: 'specific@example.com',
        id: 'specific-user-id',
        role: 'admin',
        refresh_token: 'specific-salt',
      });
    });
  });

  describe('Estrutura de resposta', () => {
    it('deve retornar a estrutura correta de resposta em caso de sucesso', async () => {
      const mockUser: Partial<User> = {
        id: 'user-id-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'hashed-password',
        salt: 'salt-value',
        role: 'user' as any,
      };

      mockGetUser.mockResolvedValue(mockUser as User);
      mockVerifyPassword.mockReturnValue(true);

      await loginController(
        mockRequest as FastifyRequest<{ Body: { email: string; password: string } }>,
        mockReply as FastifyReply
      );

      const sendCall = (mockReply.send as jest.Mock).mock.calls[0][0];
      expect(sendCall).toHaveProperty('name');
      expect(sendCall).toHaveProperty('email');
      expect(sendCall).toHaveProperty('role');
      expect(sendCall).toHaveProperty('accessToken');
      expect(sendCall).toHaveProperty('refreshToken');
      expect(typeof sendCall.accessToken).toBe('string');
      expect(typeof sendCall.refreshToken).toBe('string');
      expect(sendCall.name).toBe('John Doe');
      expect(sendCall.email).toBe('test@example.com');
    });
  });
});
