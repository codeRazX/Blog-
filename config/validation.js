import { body, param } from "express-validator";
import prisma from './prismaClient.js';

export const validationUser = [
    body('username')
    .notEmpty().withMessage('Username is required').bail()
    .isLength({max: 30}).withMessage('Username must be at most 30 characters').bail()
    .custom(async (value) => {
        const alreadyUsername = await prisma.user.findUnique({
            where: {username: value}
        });

        if(alreadyUsername){
            throw new Error('This username is already taken, please choose another one');
        }

        return true
    }),

    body('email')
    .trim()
    .notEmpty().withMessage('Email is required').bail()
    .isEmail().withMessage('Please enter a valid email').bail()
    .normalizeEmail()
    .custom(async (value) => {
        const alreadyEmail = await prisma.user.findUnique({
            where: {email: value}
        });

        if(alreadyEmail){
            throw new Error('There is already a registered user with this email, please try another one');
        }
        return true;
    }),

    body('password')
    .notEmpty().withMessage('Password is required').bail()
    .isLength({min: 8, max: 30}).withMessage('Password must be between 8 and 30 characters'),

    body('confirm_password')
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords do not match');
        }
        return true;
    })

]

export const validationLogin = [
    body('email')
    .notEmpty().withMessage('Email is required'),

    body('password')
    .notEmpty().withMessage('Password is required')
]

export const validationFieldsPost = [
    body('title')
    .notEmpty().withMessage('Title is required').bail()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters').bail()
    .custom(async (value) => {
        const alreadyTitlePost = await prisma.post.findUnique({
            where: {title: value}
        });
        if(alreadyTitlePost)  throw new Error('A post with this title already exists');
        return true;
    }),

    body('author')
    .notEmpty().withMessage('Author is required').bail()
    .isLength({max: 50}).withMessage('Author must be at most 50 characters'),

    body('content')
    .notEmpty().withMessage('Content is required')
]

export const validationFieldsPostEdit = [
   body('title')
    .notEmpty().withMessage('Title is required').bail()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters').bail(),

    body('author')
    .notEmpty().withMessage('Author is required').bail()
    .isLength({max: 50}).withMessage('Author must be at most 50 characters'),

    body('content')
    .notEmpty().withMessage('Content is required')
]

export const validationSelectPost = [
    param('pid')
    .notEmpty().withMessage('Select post is required')
    .custom(async (value) => {
        const alreadyPost = await prisma.post.findUnique({
            where: {id: Number(value)}
        });

        if(!alreadyPost) throw new Error('Access denied');
    })
]

export const validateFieldComment = [
  body('comment')
  .notEmpty().withMessage('Oops! Looks like you forgot to write a comment')
]