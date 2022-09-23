import express from 'express'
const router = express.Router();
import { body, param } from 'express-validator';
import message from '../helper/message.js'
import user from '../controller/user.js'

router.post("/signUp", [
    body("firstName").exists().withMessage(message.FIRSTNAME_IS_REQUIRED).isLength({ min: 2 }).withMessage(message.INVALID_FIRSTNAME),
    body("lastName").exists().withMessage(message.LASTNAME_IS_REQUIRED).isLength({ min: 2 }).withMessage(message.INVALID_LASTNAME),
    body("mobile").exists().withMessage(message.MOBILE_NUMBER_REQUIRED).isLength({ min: 10, max: 10 }).withMessage(message.INVALID_MOBILE),
    body("password").exists().withMessage(message.PASSWORD_REQUIRED).isLength({ min: 10, max: 10 }).withMessage(message.PASSWORD_MUST_BE_8_CHARACTERS_LONG),
]
    , user.signUp)

router.post("/signIn", [
    body("mobile").exists().withMessage(message.MOBILE_NUMBER_REQUIRED).isLength({ min: 10, max: 10 }).withMessage(message.INVALID_MOBILE),
    body("password").exists().withMessage(message.PASSWORD_REQUIRED).isLength({ min: 10, max: 10 }).withMessage(message.PASSWORD_MUST_BE_8_CHARACTERS_LONG),
]
    , user.signIn)


export default router