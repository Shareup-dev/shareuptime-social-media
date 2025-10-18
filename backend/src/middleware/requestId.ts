import { randomUUID } from 'crypto';

import type { Request, Response, NextFunction } from 'express';

// Request ID middleware
// - Reuses incoming X-Request-Id if present; otherwise generates a new UUID
// - Sets req.requestId (typed)
// - Adds X-Request-Id response header
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const incoming = req.header('x-request-id');
  const id =
    typeof incoming === 'string' && incoming.trim() ? incoming.trim().slice(0, 128) : randomUUID();

  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
};

export default requestId;
