
import type { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger.js'
import type { AuthRequest } from '../types/interface.js'

export const CatchAsync =
  (
    passedFunc: (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await passedFunc(req, res, next)
    } catch (error) {
      logger.error(error)
      return next(error)
    }
  }
