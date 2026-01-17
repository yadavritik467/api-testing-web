import type { CookieOptions } from 'express'
import { IS_PROD } from '../config/environment.js'
import { AppError } from '../errors/AppError.js'
import { CatchAsync } from '../errors/CatchAsync.js'
import { MissingFieldRequired } from '../errors/validation.js'
import { User } from '../models/user.model.js'
import { sendResponse } from '../utils/feature.js'
import { compare_password, generate_token } from '../utils/security.js'

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

  await User.create({ ...req.body })

  return sendResponse(res, 'User registered', 201, {}, true)
})

export const login_api = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body
  const missing_field = MissingFieldRequired(['email', 'password'], req)
  if (missing_field?.length) {
    return next(
      new AppError(`These fields ${missing_field.join(',')} are required`, 400)
    )
  }

  const userExists = await User.findOne(email)
  if (!userExists) return next(new AppError(`User does not exist`, 404))

  const is_match = await compare_password(
    password,
    userExists?.password as string
  )
  if (!is_match) return next(new AppError(`Wrong password`, 400))

  const token = generate_token(userExists?._id?.toString())

  const cookie_options: CookieOptions = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  }
  res.cookie('token', token, { ...cookie_options })
  return sendResponse(res, 'Login Successfully ', 200)
})

export const my_profile = CatchAsync(async (req, res, next) => {
  const userId = req?.user?._id
  const user = await User.findById(userId).select('-password')
  if (!user) {
    return next(new AppError('User not found', 404))
  }
  return sendResponse(res,"",200,{user})
})
