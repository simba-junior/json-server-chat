import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto'

export const generateIdAndDate = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'POST') {
    const id = crypto.randomBytes(16).toString("hex")
    const dateNow = Date.now()

    req.body.createdAt = Date.now()
    req.body = {
      ...req.body,
      id,
      createdAt: new Date(dateNow).toISOString()
    }
  }
  next()
}