const express= require('express')
const userController=require('./../../controllers/v1/user')
const isUserMiddleware= require('./../../middlewares/auth')
const isAdminMiddleware= require('./../../middlewares/isAdmin');
const verifyToken = require('../../middlewares/verifyToken');
const router=express.Router();



router.route('/role').put(isUserMiddleware,isAdminMiddleware,userController.changeRole)
router.route('/delete/:id').delete(isUserMiddleware,isAdminMiddleware,userController.removeUser)
router.route('/').get(verifyToken,isUserMiddleware,userController.getAll).put(isUserMiddleware,userController.updateInfo)
router.route('/ban/:id').post(isUserMiddleware,isAdminMiddleware,userController.banUser);

module.exports=router