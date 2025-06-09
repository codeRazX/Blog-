import 'dotenv/config';

export const {
    URL_CLIENT_PROD,
    URL_CLIENT_PROD_ADMIN,
    URL_CLIENT_DEV,
    NODE_ENV,
    ADMIN_EMAIL,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    SALT,
    JWT_SECRET_KEY,
    PATH_LOGIN,
    ROLE_ADMIN,
    PATH_POST_ADMIN
} = process.env;