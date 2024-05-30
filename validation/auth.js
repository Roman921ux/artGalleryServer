import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'Неккоректный email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('firstName').isLength({ min: 3 }),
]

export const loginValidation = [
  body('email', 'Неккоректный email').isEmail(),
  body('password').isLength({ min: 5 })
]




