import { AppError } from '../errors/AppError.js'
import { CatchAsync } from '../errors/CatchAsync.js'
import { MissingFieldRequired } from '../errors/validation.js'
import { User } from '../models/user.js'
import { sendResponse } from '../utils/feature.js'

export const create_user_api = CatchAsync(async (req, res, next) => {
  const { email, password, name } = req.body
  const missing_field = MissingFieldRequired(['email', 'password', 'name'], req)
  if (missing_field?.length) {
    return next(
      new AppError(`These fields ${missing_field.join(',')} are required`, 400)
    )
  }

  const userExists = await User.findOne(email)
  if (userExists) return next(new AppError(`User already exists`, 400))

  await User.create(...req.body)

  return sendResponse(res, 'User registered', 201, {}, true)
})
