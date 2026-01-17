import { AppError } from '../errors/AppError.js'
import { CatchAsync } from '../errors/CatchAsync.js'
import type { AuthRequest } from '../types/interface.js'
import { verify_token } from '../utils/security.js'

export const auth_middleware = CatchAsync(
  async (req: AuthRequest, res, next) => {
    const token = req.cookies?.token
    if (!token) return next(new AppError('No token provide', 401))
    const decode = verify_token(token, next)
    req.user = decode
    return next()
  }
)
