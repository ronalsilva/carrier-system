import { getUser } from '../../../modules/login/login.service';
import handleError from '@utils/handleError';
import { User } from '@prisma/client';

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

const mockHandleError = handleError as jest.MockedFunction<typeof handleError>;

describe('Login Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('deve retornar usuário quando encontrado', async () => {
      const mockUser: Partial<User> = {
        id: 'user-id-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'hashed-password',
        salt: 'salt-value',
        role: 'user' as any,
        terms_of_service: false,
        created_at: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUser('test@example.com');

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
    });

    it('deve retornar undefined quando ocorrer erro', async () => {
      const prismaError = { code: 'P1001', message: 'Conexão falhou' };
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(prismaError);

      const result = await getUser('test@example.com');

      expect(mockHandleError).toHaveBeenCalledWith(prismaError);
      expect(result).toBeUndefined();
    });
  });
});
