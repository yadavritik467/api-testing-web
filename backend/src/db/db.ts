import mongoose from 'mongoose'
import logger from '../utils/logger.js'
import { DB_URL } from '../config/environment.js'
export const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URL)
    logger.info('🚀 Database connected successfully')
  } catch (error) {
    logger.error(
      `❌ DB connection failed: ${error instanceof Error ? error.message : error}`
    )
  }
}
