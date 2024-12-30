import express from 'express';
import tryCatch from '../util/tryCatch.js';
import { loginUser, registerUser } from '../controllers/auth/authController.js';
const routes = express.Router();

routes
.post('/register', tryCatch(registerUser))
.post('/login', tryCatch(loginUser))

export default routes;