import { randomUUID } from 'crypto';

import type { Request, Response, NextFunction } from 'express';

// Minimal request ID middleware
// - Sets req.requestId
// - Adds X-Request-Id response header
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const id = randomUUID();
  (req as any).requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
};

export default requestId;
