import { body } from 'express-validator'

export const artCreateValidation = [
  body('title').isLength({ min: 3 }).isString(),
  body('text').optional().isLength({ min: 5 }).isString(),
  // body('tags').optional().isArray(),
  body('imageUrl').optional().isURL(),
]  