import express from 'express'
import {getOneUser} from '../controllers/user/userController.js'
const Router = express.Router()
Router
.get('/profile/:username', getOneUser)

export default Router