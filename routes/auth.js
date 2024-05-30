import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.js";
import { checkAuth } from "../utils/checkAuth.js";
import { loginValidation, registerValidation } from "../validation/auth.js";
const router = new Router()

//
router.post('/register', registerValidation, register)
//
router.post('/login', loginValidation, login)
// 
router.get('/me', checkAuth, getMe)

export default router  