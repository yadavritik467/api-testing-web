import type { Response } from 'express'

export const sendResponse = (
  res: Response,
  message: string,
  status = 200,
  data?: any,
  success: boolean = true
) => {
  return res.status(status).json({ success, message, ...data })
}
