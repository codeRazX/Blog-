import express from 'express';
import cors from 'cors';
import { URL_CLIENT_DEV, URL_CLIENT_PROD_ADMIN, URL_CLIENT_PROD} from './config/enviroment.js';
import { handleError } from './middleware/midleware.js';
import router from './router/router.js';
import './config/populateDB.js';
import cookieParser from "cookie-parser";
const app = express();


const allowedDomains = [URL_CLIENT_DEV];
const corsOptions  = {
    origin: (origin, callback) => {
        if(allowedDomains.indexOf(origin) !== -1){
            callback(null,true);
        }
        else{
            const error = new Error('Not allowed by CORS');
            error.status = 403;
            callback(error);
        }
    }
}
app.use(cors({origin: corsOptions, credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(router);



app.use(handleError);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log('Server running on PORT: ', PORT));