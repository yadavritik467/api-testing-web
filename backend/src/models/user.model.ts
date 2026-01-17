import mongoose from 'mongoose'

interface IUser {
  name: string
  email: string
  password: string
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>('User', userSchema)
