import express from 'express'
import {
  create_user_api,
  login_api,
  my_profile,
} from '../controller/user.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'
import { add_collaborator_api, get_all_collaborator_api } from '../controller/collaboration.controller.js'

const router = express.Router()

router.post('/add-collaboration', auth_middleware,add_collaborator_api)
router.get('/all-collaborators',auth_middleware, get_all_collaborator_api)

export default router
