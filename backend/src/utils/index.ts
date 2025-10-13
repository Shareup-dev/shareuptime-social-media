import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse, PaginatedResponse } from '../types';

// Şifre hashleme
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Şifre doğrulama
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// JWT token oluşturma
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// JWT token doğrulama
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    return jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    return null;
  }
};

// Standart API response oluşturma
export const createResponse = <T>(
  success: boolean,
  message: string,
  data?: T | undefined,
  error?: string | undefined
): ApiResponse<T> => {
  return {
    success,
    message,
    data: data as T | undefined,
    error: error as string | undefined
  };
};

// Paginated response oluşturma
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Veriler başarıyla getirildi'
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};

// Email doğrulama
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username doğrulama
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Güvenli string temizleme
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};