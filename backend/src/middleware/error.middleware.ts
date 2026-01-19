import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/AppError.js'
import { IS_PROD } from '../config/environment.js'
import { sendResponse } from '../utils/feature.js'

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500
  let message = 'Internal Server Error'

  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  }
  if (!IS_PROD) {
    return sendResponse(res, message, statusCode, { stack: err.stack }, false)
  }
  return sendResponse(res, message, statusCode, {}, false)
}
