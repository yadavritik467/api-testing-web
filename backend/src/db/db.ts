import mongoose from 'mongoose'
export const dbConnection = async () => {
 
 
 
 
 
 
 
 
 
  let isConnected = false

  try {
    console.log('please wait db is tring to connecting ..')

    await mongoose.connect('mongodb://mongo:27017/api-testing-web')

    console.log('db connected')









    
  } catch (error: any) {
    console.log('db connection failed', error.message)
  }
}
