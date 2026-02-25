import {
  createUserController,
  getUserController,
  updateUserController,
  deleteUserController,
} from '@modules/user/user.controller';
import { createUser, getUser, getUserById, updateUser, deleteUser } from '@modules/user/user.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '@prisma/client';

jest.mock('@modules/user/user.service');

const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockGetUserById = getUserById as jest.MockedFunction<typeof getUserById>;
const mockUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;
const mockDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;

describe('User Controller', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockJwtVerify: jest.Mock;

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
    it('deve criar um usuário com sucesso', async () => {
      const mockUserData: Partial<User> = {
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
      mockCreateUser.mockResolvedValue(mockCreatedUser as any);

      await createUserController(
        mockRequest as FastifyRequest<{ Body: User }>,
        mockReply as FastifyReply
      );

      expect(mockCreateUser).toHaveBeenCalledWith(mockUserData);
      expect(mockReply.send).toHaveBeenCalledWith(mockCreatedUser);
      expect(mockReply.code).not.toHaveBeenCalled();
    });

    it('deve retornar undefined quando o service retornar undefined', async () => {
      const mockUserData: Partial<User> = {
        email: 'john@example.com',
        password: 'password123',
      };

      mockRequest.body = mockUserData;
      mockCreateUser.mockResolvedValue(undefined);

      await createUserController(
        mockRequest as FastifyRequest<{ Body: User }>,
        mockReply as FastifyReply
      );

      expect(mockCreateUser).toHaveBeenCalledWith(mockUserData);
      expect(mockReply.send).toHaveBeenCalledWith(undefined);
    });

    it('deve passar os dados corretos do body para o service', async () => {
      const mockUserData: Partial<User> = {
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
      mockCreateUser.mockResolvedValue(mockCreatedUser as any);

      await createUserController(
        mockRequest as FastifyRequest<{ Body: User }>,
        mockReply as FastifyReply
      );

      expect(mockCreateUser).toHaveBeenCalledWith(mockUserData);
      expect(mockReply.send).toHaveBeenCalledWith(mockCreatedUser);
    });
  });

  describe('getUserController', () => {
    it('deve retornar o usuário quando o JWT for válido', async () => {
      const mockUser: Partial<User> = {
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
      mockGetUserById.mockResolvedValue(mockUser as User);

      await getUserController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUserById).toHaveBeenCalledWith('user-id-123');
      expect(mockReply.send).toHaveBeenCalledWith(mockUser);
      expect(mockReply.code).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o JWT for inválido', async () => {
      const jwtError = new Error('Invalid token');
      mockJwtVerify.mockRejectedValue(jwtError);

      await expect(
        getUserController(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).rejects.toThrow('Invalid token');

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUserById).not.toHaveBeenCalled();
      expect(mockReply.send).not.toHaveBeenCalled();
    });

    it('deve usar o id do JWT decodificado para buscar o usuário', async () => {
      const mockUser: Partial<User> = {
        id: 'user-id-789',
        email: 'different@example.com',
        first_name: 'Different',
        last_name: 'User',
      };

      mockJwtVerify.mockResolvedValue({ id: 'user-id-789' });
      mockGetUserById.mockResolvedValue(mockUser as User);

      await getUserController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUserById).toHaveBeenCalledWith('user-id-789');
      expect(mockReply.send).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateUserController', () => {
    it('deve atualizar o usuário com sucesso', async () => {
      const existingUser: Partial<User> = {
        id: 'user-id-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };

      const updateData: Partial<User> = {
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
      mockGetUser.mockResolvedValue(existingUser as User);
      mockUpdateUser.mockResolvedValue(updatedUser as any);
      mockRequest.body = updateData;

      await updateUserController(
        mockRequest as FastifyRequest<{ Body: User }>,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockUpdateUser).toHaveBeenCalledWith('test@example.com', updateData);
      expect(mockReply.send).toHaveBeenCalledWith(updatedUser);
      expect(mockReply.code).not.toHaveBeenCalled();
    });

    it('deve retornar erro 404 quando o usuário não for encontrado', async () => {
      mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
      mockGetUser.mockResolvedValue(undefined as any);
      mockRequest.body = { first_name: 'Jane' };

      await updateUserController(
        mockRequest as FastifyRequest<{ Body: User }>,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockUpdateUser).not.toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
    });

    it('deve retornar erro 404 quando o usuário for null', async () => {
      mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
      mockGetUser.mockResolvedValue(null as any);
      mockRequest.body = { first_name: 'Jane' };

      await updateUserController(
        mockRequest as FastifyRequest<{ Body: User }>,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockUpdateUser).not.toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
    });

    it('deve lançar erro quando o JWT for inválido', async () => {
      const jwtError = new Error('Invalid token');
      mockJwtVerify.mockRejectedValue(jwtError);
      mockRequest.body = { first_name: 'Jane' };

      await expect(
        updateUserController(
          mockRequest as FastifyRequest<{ Body: User }>,
          mockReply as FastifyReply
        )
      ).rejects.toThrow('Invalid token');

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).not.toHaveBeenCalled();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('deve usar os dados do body para atualizar o usuário', async () => {
      const existingUser: Partial<User> = {
        id: 'user-id-123',
        email: 'test@example.com',
      };

      const updateData: Partial<User> = {
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
      mockGetUser.mockResolvedValue(existingUser as User);
      mockUpdateUser.mockResolvedValue(updatedUser as any);
      mockRequest.body = updateData;

      await updateUserController(
        mockRequest as FastifyRequest<{ Body: User }>,
        mockReply as FastifyReply
      );

      expect(mockUpdateUser).toHaveBeenCalledWith('test@example.com', updateData);
      expect(mockReply.send).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('deleteUserController', () => {
    it('deve deletar o usuário com sucesso', async () => {
      const existingUser: Partial<User> = {
        id: 'user-id-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };

      mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
      mockGetUser.mockResolvedValue(existingUser as User);
      mockDeleteUser.mockResolvedValue(undefined as any);

      await deleteUserController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockDeleteUser).toHaveBeenCalledWith('test@example.com');
      expect(mockReply.send).toHaveBeenCalledWith(undefined);
      expect(mockReply.code).not.toHaveBeenCalled();
    });

    it('deve retornar erro 404 quando o usuário não for encontrado', async () => {
      mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
      mockGetUser.mockResolvedValue(undefined as any);

      await deleteUserController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockDeleteUser).not.toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
    });

    it('deve retornar erro 404 quando o usuário for null', async () => {
      mockJwtVerify.mockResolvedValue({ email: 'test@example.com' });
      mockGetUser.mockResolvedValue(null as any);

      await deleteUserController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalledWith('test@example.com');
      expect(mockDeleteUser).not.toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'NOT_FOUND', message: 'User not found' });
    });

    it('deve lançar erro quando o JWT for inválido', async () => {
      const jwtError = new Error('Invalid token');
      mockJwtVerify.mockRejectedValue(jwtError);

      await expect(
        deleteUserController(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).rejects.toThrow('Invalid token');

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockGetUser).not.toHaveBeenCalled();
      expect(mockDeleteUser).not.toHaveBeenCalled();
    });

    it('deve usar o email do usuário encontrado para deletar', async () => {
      const existingUser: Partial<User> = {
        id: 'user-id-456',
        email: 'different@example.com',
        first_name: 'Different',
        last_name: 'User',
      };

      mockJwtVerify.mockResolvedValue({ email: 'different@example.com' });
      mockGetUser.mockResolvedValue(existingUser as User);
      mockDeleteUser.mockResolvedValue(undefined as any);

      await deleteUserController(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(mockDeleteUser).toHaveBeenCalledWith('different@example.com');
      expect(mockReply.send).toHaveBeenCalledWith(undefined);
    });
  });
});
