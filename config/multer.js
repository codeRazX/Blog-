import multer from 'multer';


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg','image/jpg','image/svg+xml','image/png','image/gif','image/webp'];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(new Error('Not valid file'), false);
    }
}

const upload = multer({storage, fileFilter, limits:{
    fileSize: 5 * 1024 * 1024
}});

export default upload;