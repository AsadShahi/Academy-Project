const express= require('express')
const router=express.Router()
const isUserMiddleware= require('./../../middlewares/auth')
const isAdminMiddleware= require('./../../middlewares/isAdmin')
const multer = require('multer')
const multerStorage= require('./../../utils/uploader')
const courseController=require('./../../controllers/v1/course')


router.route('/').post(multer({storage:multerStorage, limits:{fileSize:1000000000}}).single('cover')
,isUserMiddleware,isAdminMiddleware,courseController.create

)


router.route('/:id').post(multer({storage:multerStorage, limits:{fileSize:1000000000}}).single('video')
,isUserMiddleware,isAdminMiddleware,courseController.createSession

)


router.route('/sessions').get(isUserMiddleware,isAdminMiddleware,courseController.getAllSessions)


router.route('/:href/:sessionID').get(courseController.getSessionInfo)


router.route('/sessions/:id').delete(isUserMiddleware,isAdminMiddleware,courseController.removeSession)


// register user in course

router.route('/:id/register').post(isUserMiddleware,courseController.register)

// find using category 
router.route('/category/:href').get(courseController.getCourseByCategory);

// get every course single
router.route('/:href').get(isUserMiddleware,courseController.getOne)

// delete any course using ID ocurse
router.route('/:id').delete(isUserMiddleware,isAdminMiddleware,courseController.removeCourse)

// find related course
router.route('/related/related/:href').get(courseController.relatedCourse)







module.exports=router