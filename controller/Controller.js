import { generateError, helperSuccess, generateCookie, clearCookie, handleAnyErrorCatch, streamUpload } from "../helper/helpers.js";
import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { PATH_LOGIN, ROLE_ADMIN, PATH_POST_ADMIN, SALT } from "../config/enviroment.js";
import cloudinary from '../config/cloudinary.js';
import { sanitizeHtmlContent } from "../config/sanitize.js";


export default class Controller {

    static getStatus = async (req, res, next) => {

        try{
            const user = req.user;
          
            if(!user) return helperSuccess(req, res, '', 200, false);
            const {username, role} = user;
         
            if(role === ROLE_ADMIN){
                return helperSuccess(req, res, '', 200, true, {auth: true, username});
            }
            return helperSuccess(req, res, '', 200, true, {username});
        }
        catch(err){
            handleAnyErrorCatch(err, next);
        }
        
    }


    static login = async (req, res, next) => {
       
       
        try{
            const existsUser = req.user;
            if(existsUser) return generateError(req, res, next, 'You are already logged in', 409);

            const {email, password} = req.body;

            const user = await prisma.user.findUnique({
                where: {email}
            });
           
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return generateError(req, res, next, 'Invalid username or password', 422);
            }
           
            if(req.path === PATH_LOGIN && user.role !== ROLE_ADMIN) return generateError(req, res, next, 'Access denied', 403);
            generateCookie(res, {userID: user.id, username: user.username, role: user.role});
            return helperSuccess(req, res, 'Login was successful', 200);
        }
        catch(err){
            handleAnyErrorCatch(err, next);
        }

    }

    static createUser = async (req, res, next) => {
        
        try{
            const {username, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, Number(SALT));
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password : hashedPassword
                }
            });
            return helperSuccess(req, res, 'User successfully registered', 201);
        }
        catch(err){
           handleAnyErrorCatch(err, next);
        }
     
    }

    static createPost = async (req, res, next) => {

        try{   
            const {title, author, tags, content} = req.body;
            let image = req.file || null;
            let publicID = null;
            const {userID} = req.user;
            
            if(image){
               const result = await streamUpload(image.buffer);
               image = result.secure_url;
               publicID = result.public_id;
            }
            
            const clean = sanitizeHtmlContent(content);

            await prisma.post.create({
                data:{
                    title,
                    author,
                    tags,
                    image,
                    imageId: publicID,
                    userId: userID,
                    content : clean
                }
            });

            return helperSuccess(req, res, 'Post successfully created', 201);
        }
        catch(err){
            handleAnyErrorCatch(err, next);
        }
      
    }

    static logout = (req, res, next) => {
        try{
            clearCookie(res);
            return helperSuccess(req, res, 'Logged out successfully', 200);
        }
        catch(err){
            handleAnyErrorCatch(err, next);
        }
    }


    static getPost = async (req, res, next) => {
        try{
            let posts;

            if(req.path === PATH_POST_ADMIN){
                posts = await prisma.post.findMany({
                select: {
                    title: true,
                    id: true
                }
            });
            }
            else{
                posts = await prisma.post.findMany({
                    omit: {
                        userId: true,
                        imageId: true
                    }
                })
            }
            
           
            return helperSuccess(req, res, '', 200, true, posts);
        }
        catch(err){
            handleAnyErrorCatch(err, next);
        }
    }

    static getPostById = async (req, res, next) => {
        const {pid} = req.params;
        if(!pid) return generateError(req, res, next, 'Access denied', 403);

        try{
            const post = await prisma.post.findUnique({
                where: {id: Number(pid)},
                omit: {userId: true, imageId: true},
                include: {comments: true}
            });

            
            return helperSuccess(req, res, '', 200, true, post);
        }
        catch(err){
            handleAnyErrorCatch(err, next);
        }
    }

    static deletePost = async (req, res, next) => {
      const {pid} = req.params;
      if(!pid) return generateError(req, res, next, 'Access denied', 403);

      try{
        const post = await prisma.post.delete({
          where: {id: Number(pid)}
        });

        if(post.imageId) await cloudinary.uploader.destroy(post.imageId);
      
        return helperSuccess(req, res, 'Post deleted successfully', 200);
      }
      catch(err){
        handleAnyErrorCatch(err, next);
      }
    }


    static editPost = async (req, res, next) => {

      try{
        const {title, author, tags, content} = req.body;
        const {pid} = req.params;

        const currentPost = await prisma.post.findUnique({
          where: {id: Number(pid)}
        });

        if(!currentPost) return generateError(req, res, next, 'Post not found', 404);

        let image = currentPost.image;
        let publicID = currentPost.imageId;
            
        if(req.file){
          const result = await streamUpload(req.file.buffer);
          image = result.secure_url;
          publicID = result.public_id;

          if(currentPost.imageId) await cloudinary.uploader.destroy(currentPost.imageId);
        }
        
        if(title === currentPost.title && author === currentPost.author && tags === currentPost.tags && content === currentPost.content && image === currentPost.image && publicID === currentPost.imageId){
          return generateError(req, res, next, 'Not changes detected', 409);
        }
        const clean = sanitizeHtmlContent(content);

        await prisma.post.update({
            where: {id: Number(pid)},
            data:{
                title,
                author,
                tags,
                image,
                imageId: publicID,
                content : clean
            }
        });

        return helperSuccess(req, res, 'Post updated successfully', 200);
        
      }
      catch(err){
        handleAnyErrorCatch(err, next);
      }
     
    }


    static createComment = async (req, res, next) => {
      try{
        const {pid} = req.params;
        const {comment} = req.body;
        if(!pid || !comment) return generateError(req, res, next, 'Something went wrong. Please try again later', 400);
        const {username} = req.user;

        await prisma.comment.create({
          data: {
            author: username,
            content: comment,
            postId: Number(pid)
          }
        });
         const post = await prisma.post.findUnique({
          where: {id: Number(pid)},
          omit: {userId: true, imageId: true},
          include: {comments: true}
        });
        return helperSuccess(req,res, 'Comment posted successfully', 201, true, post);
      }
      catch(err){
        console.log(err);
        handleAnyErrorCatch(err, next);
      }
    }

    static deleteComment = async (req, res, next) => {
      try{
        const {cid} = req.params;
        if(!cid) return generateError(req, res, next, 'Something went wrong. Please try again later', 400);

        await prisma.comment.delete({
          where: {id: Number(cid)}
        });

        return helperSuccess(req, res, 'Comment deleted successfully', 200);

      }
      catch(err){
        handleAnyErrorCatch(err, next);
      }
    }
}