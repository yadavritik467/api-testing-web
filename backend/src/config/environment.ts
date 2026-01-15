import { configDotenv } from 'dotenv'

configDotenv({ path: './.env' })
export const JWT_SECRET = process.env.JWT_SECRET as string
export const PORT = process.env.PORT as string
//   frontedn envrionment
export const FRONT_URL = process.env.FRONT_URL as string

//  db environment
export const DB_URL = process.env.DB_URL as string

export const IS_PROD = process.env.NODE_ENV === 'PROD'