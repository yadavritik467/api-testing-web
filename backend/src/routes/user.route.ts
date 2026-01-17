import express from 'express'
import { create_user_api, login_api } from '../controller/user.controller.js'

const router = express.Router()

router.post('/signup', create_user_api)
router.post('/login', login_api)

export default router
