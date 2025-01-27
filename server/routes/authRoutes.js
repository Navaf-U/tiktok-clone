import express from 'express';
import tryCatch from '../util/tryCatch.js';
import { loginUser, refreshingToken, registerUser, userLogout } from '../controllers/auth/authController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
const routes = express.Router();

routes
.post('/register', tryCatch(registerUser))
.post('/login', tryCatch(loginUser))
.post("/refreshToken",tryCatch(refreshingToken))
.post("/logout",verifyToken,tryCatch(userLogout))

export default routes;