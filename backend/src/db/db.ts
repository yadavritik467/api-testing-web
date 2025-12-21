import mongoose from 'mongoose'
import logger from '../utils/logger.js'
export const dbConnection = async () => {
  try {
    await mongoose.connect('mongodb://mongo:27017/api-testing-web')
    logger.info('🚀 Database connected successfully')
  } catch (error) {
    logger.error(
      `❌ DB connection failed: ${error instanceof Error ? error.message : error}`
    )
  }
}
