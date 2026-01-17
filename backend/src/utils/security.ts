import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/environment.js'

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
  const token = jwt.sign({ _id: userId }, JWT_SECRET,{expiresIn:'1d'})
  return token
}
