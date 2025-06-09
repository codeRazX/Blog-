import jwt from 'jsonwebtoken';
import {JWT_SECRET_KEY, NODE_ENV} from '../config/enviroment.js';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

export const generateError = (req, res, next, message, status, details = null ) => {
    const error = new Error(message);
    error.status = status;
    error.details = details;
    return next(error);
}

export const objError = (errors) => {
    return errors.array().reduce((acc, {path, msg}) => {
        acc[path] = msg;
        return acc;
    }, {});
}

export const helperSuccess = (req, res, message, status = 200, success = true, data = null) => {
    res.status(status).json({
        success,
        message,
        data
    })
};

export const generateCookie = (res, data) => {
    const token = jwt.sign(data, JWT_SECRET_KEY);
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production'? 'None' : 'Lax'
    });
}

export const clearCookie = (res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production'? 'None' : 'Lax',
    })
};

export const handleAnyErrorCatch = (err, next) => {
    console.log(err);
    err.message = 'Something went wrong. Please try again later';
    next(err);
}

export const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    })
}

