import { Router } from "express";
import Controller from '../controller/Controller.js';
import { validationUser, validationLogin, validationFieldsPost, validationSelectPost, validationFieldsPostEdit, validateFieldComment } from "../config/validation.js";
import {validateToken, validateRequest} from '../middleware/midleware.js';
import upload from '../config/multer.js';
const router = Router();


router.get('/auth/status', validateToken(false, false), Controller.getStatus);
router.get('/read/post', validateToken(false, true), Controller.getPost);
router.get('/read/post/public', Controller.getPost);
router.get('/read/:pid/post', validateToken(false, true), validationSelectPost, validateRequest, Controller.getPostById);
router.get('/read/:pid/post/public', Controller.getPostById);

router.post('/public/create/user', validationUser, validateRequest , Controller.createUser);
router.post('/create/user',validateToken(false, true), validationUser, validateRequest, Controller.createUser);
router.post('/create/post', validateToken(false, true), upload.single('image'), validationFieldsPost, validateRequest, Controller.createPost);
router.post('/login', validateToken(false, false), validationLogin, validateRequest ,Controller.login);
router.post('/public/login',validateToken(false, false), validationLogin, validateRequest, Controller.login);
router.post('/logout', validateToken(true, false), Controller.logout);
router.post('/create/:pid/comment', validateToken(true, false), validateFieldComment, validateRequest, Controller.createComment);
router.patch('/edit/:pid/post', validateToken(false, true), upload.single('image'), validationFieldsPostEdit, validateRequest, Controller.editPost);

router.delete('/delete/:pid/post', validateToken(false, true), Controller.deletePost);
router.delete('/delete/:cid/comment', validateToken(false, true), Controller.deleteComment);

export default router;