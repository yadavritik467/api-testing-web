
import type { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger.js'

export const CatchAsync =
  (
    passedFunc: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await passedFunc(req, res, next)
    } catch (error) {
      logger.error(error)
      return next(error)
    }
  }
