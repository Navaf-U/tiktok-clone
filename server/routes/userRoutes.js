import express from 'express'
import tryCatch from '../util/tryCatch.js'
import {getOneUser, userUpdate} from '../controllers/user/userController.js'
import { verifyToken } from '../middlewares/verifyToken.js';
const Router = express.Router()
Router
.get('/profile/:username', tryCatch(getOneUser))
.patch("/profile/update", verifyToken,tryCatch(userUpdate));


export default Router