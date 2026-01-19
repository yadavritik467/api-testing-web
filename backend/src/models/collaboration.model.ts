import mongoose from 'mongoose'
import type { ICollaboration } from '../types/interface.js'

const collaborationSchema = new mongoose.Schema<ICollaboration>(
  {
    collaboratorID: {
      type: String,
      require: true,
      ref: 'User',
    },
    collectionID: {
      type: String,
      require: true,
      ref: 'Collection',
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    invitedBy: {
      type: String,
      require: true,
      ref: 'User',
    },
  },
  { timestamps: true }
)

export const Collaboration = mongoose.model<ICollaboration>(
  'Collaboration',
  collaborationSchema
)
