import type { Request } from 'express'

export interface ICollaboration {
  collaboratorID: string
  collectionID: string
  isAccepted: boolean
  invitedBy: string
}
export interface IUser {
  name: string
  email: string
  password: string
}

export interface UserInterface {
  _id: string
}

export interface AuthRequest extends Request {
  user?: UserInterface
}
