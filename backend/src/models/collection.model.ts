import mongoose from 'mongoose'
// import type { ICollaboration } from '../types/interface.js'

const collectionSchema = new mongoose.Schema<any>(
  {
    userID: {
      type: String,
      require: true,
      ref: 'User',
    },
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

export const Collaboration = mongoose.model<any>('Collection', collectionSchema)
