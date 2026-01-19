import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/environment.js'
import type { NextFunction } from 'express'
import logger from './logger.js'
import { AppError } from '../errors/AppError.js'

export const hashed_password = async (password: string): Promise<string> => {
  const hashed = await bcrypt.hash(password, 10)
  return hashed
}

export const compare_password = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const is_matched = await bcrypt.compare(password, hash)
  return is_matched
}

export const generate_token = (userId: string): string => {
  const token = jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: '1d' })
  return token
}

export const verify_token = (token: string, next: NextFunction) => {
  try {
    const decode: any = jwt.verify(token, JWT_SECRET)
    return decode
  } catch (error) {
    logger.error(error)
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(`JWT token has expired`, 419))
    }
    return next(new AppError(`Invalid token`, 403))
  }
}
