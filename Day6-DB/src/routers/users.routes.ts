import express  from 'express';
import { getUserController } from '../controllers/users.controllers.js';

export const routerUsers = express.Router()

routerUsers.route('/').get(getUserController)