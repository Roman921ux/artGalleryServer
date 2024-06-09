import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const errorsValid = validationResult(req)
    if (!errorsValid.isEmpty()) {
      return res.status(402).json(errors.array())
    }

    const { email, password } = req.body;
    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.status(402).json({
        message: 'Данный пользователь уже существует'
      })
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt)
    const newUser = new User({
      firstName: req.body.firstName,
      email,
      password: hash
    })

    await newUser.save()
    res.json({
      newUser, message: 'Регистрация прошла успешно'
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ошибка при регистрации',
      error
    })
  }
}

export const login = async (req, res) => {
  try {
    const isUser = await User.findOne({ email: req.body.email })
      .populate('followers.users').populate('subscriptions.users');
    if (!isUser) {
      return res.status(400).json({
        message: 'Такого пользователя не существует'
      })
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, isUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Не верный пароль'
      })
    }
    const token = jwt.sign({
      id: isUser._id
    },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )
    const { password, ...userData } = isUser._doc
    // const userData = isUser._doc


    res.json({
      token, userData, message: 'Вы авторизовались'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при авторизации'
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'arts.items',
      populate: { path: 'user' } // здесь 'user' - это название поля в схеме ArtSchema
    }).populate('followers.users').populate('subscriptions.users');
    if (!user) {
      return res.status(500).json({
        message: 'Не удалось найти пользователя'
      })
    }

    const { password, ...userData } = user._doc

    res.json(userData)
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось найти пользователя'
    })
  }
} 