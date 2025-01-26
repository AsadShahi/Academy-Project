const path = require('path')
const multer = require('multer')

module.exports = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathFile = path.join(__dirname, '..', 'public', 'courses', 'covers')
        cb(null, pathFile)
    },
    filename: (req, file, cb) => {
        const fileExtinsion = path.extname(file.originalname)
        const fileName = (file.originalname + Date.now() + Math.random())+fileExtinsion;
        // extract file name extension like jpg,pdf
        cb(null, fileName )

    }

})