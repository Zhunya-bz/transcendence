import type { UserProject, Project } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      userId: number;
    }

    interface Request {
      user?: User;
      membership?: (UserProject & { project: Project }) | null;
    }
  }
}

export {};
