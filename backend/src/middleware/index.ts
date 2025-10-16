import { Request, Response, NextFunction } from 'express';

import { verifyToken, createResponse } from '../utils';

// Kimlik doğrulama middleware'i
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" formatı

    if (!token) {
      res.status(401).json(createResponse(false, 'Token gereklidir'));
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json(createResponse(false, 'Geçersiz veya süresi dolmuş token'));
      return;
    }

    // Request objesine userId ekle
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token doğrulama middleware hatası:', error);
    res.status(401).json(createResponse(false, 'Geçersiz token'));
  }
};

// Opsiyonel kimlik doğrulama middleware'i
export const optionalAuthentication = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        (req as any).userId = decoded.userId;
      }
    }

    // Token olmasa da veya geçersiz olsa da devam et
    next();
  } catch (error) {
    // Opsiyonel kimlik doğrulama, hata olsa bile devam eder
    next();
  }
};

// Rate limiting middleware (basit implementasyon)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip rate limiting in test environment
    if (process.env.NODE_ENV === 'test') {
      next();
      return;
    }

    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Temizlik: eski kayıtları sil
    for (const [ip, data] of requestCounts.entries()) {
      if (now > data.resetTime) {
        requestCounts.delete(ip);
      }
    }

    const clientData = requestCounts.get(clientIP);

    if (!clientData) {
      // İlk istek
      requestCounts.set(clientIP, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (now > clientData.resetTime) {
      // Zaman penceresi sıfırlandı
      requestCounts.set(clientIP, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (clientData.count >= maxRequests) {
      // Limit aşıldı
      res
        .status(429)
        .json(createResponse(false, 'Çok fazla istek, lütfen daha sonra tekrar deneyin'));
      return;
    }

    // İstek sayısını artır
    clientData.count++;
    next();
  };
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`,
    );
  });

  next();
};

// Input validation middleware
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];

    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      res.status(400).json(createResponse(false, `Eksik alanlar: ${missingFields.join(', ')}`));
      return;
    }

    next();
  };
};
