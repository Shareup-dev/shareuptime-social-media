// Type augmentation for Express Request to include authenticated userId
// This allows middleware and controllers to use req.userId without casting
declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Request {
    userId?: string;
    requestId?: string;
  }
}
