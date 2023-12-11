const multer = require('multer');

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/media')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString()+'_'+file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        const mime = ['image/jpg', 'image/jpeg', 'image/png']
            .find(field => field === file.mimetype);

        if(mime){
            return cb(null, true);
        }

        return cb(null, false);
    }
}));