import mongoose from 'mongoose'
export const dbConnection = async () => {
  try {
    await mongoose.connect('mongodb://mongo:27017/api-testing-web')
    // console.log('db connected')
  } catch (error) {
    if (error instanceof Error) {
      return error?.message
    }
    return String(error)
    // console.log('db connection failed', error.message)
  }
}
