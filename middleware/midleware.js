import jwt from 'jsonwebtoken';
import { generateError, objError } from '../helper/helpers.js';
import { JWT_SECRET_KEY, ROLE_ADMIN } from '../config/enviroment.js';
import { validationResult } from "express-validator";

export const handleError = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong on the server';
    const details = error.details || null;
    if(message === 'Not allowed by CORS') return res.status(status).send(message);
    if(!res.headersSent) return res.status(status).json({message, errors: details});
}

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) return generateError(req, res, next, 'Validation failed', 422, objError(errors));

    return next();
}

export const validateToken = (requireAuth = true, requireAdmin = false)=> async (req, res, next) => {
    const {jwt: token} = req.cookies;

     if (!token) {
        if (requireAuth || requireAdmin) {
            return generateError(req, res, next, 'You must be logged in to perform this action', 401);
        } else {
            return next();
        }
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;

        if (requireAdmin && decoded.role !== ROLE_ADMIN) {
            return generateError(req, res, next, 'Access denied', 403);
        }

        next();
    }
    catch(err){
        err.message= 'Invalid token';
        next(err);
    }
    
    
}

