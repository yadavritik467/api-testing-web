import express from 'express'
import {
  create_user_api,
  login_api,
  my_profile,
} from '../controller/user.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', create_user_api)
router.post('/login', login_api)

router.get('/me', auth_middleware, my_profile)

export default router
