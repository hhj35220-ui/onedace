declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'USER' | 'SUPER_ADMIN';
        isActive: boolean;
      };
    }
  }
}

export {};
