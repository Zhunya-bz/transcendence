import { UserProject } from '../generated/prisma';

declare global {
  namespace Express {
    interface Request {
      membership?: UserProject | null;
    }
  }
}

export {};
