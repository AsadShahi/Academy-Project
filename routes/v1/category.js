const express=require('express')
const router=express.Router()

const categoryController=require('./../../controllers/v1/category')

const isUserMiddleware= require('./../../middlewares/auth')
const isAdminMiddleware= require('./../../middlewares/isAdmin')


router.route('/').post(isUserMiddleware,isAdminMiddleware,categoryController.create)
router.route('/:id').delete(isUserMiddleware,isAdminMiddleware,categoryController.remove)
router.route('/').put(isUserMiddleware,isAdminMiddleware,categoryController.update)
router.route('/').get(isUserMiddleware,isAdminMiddleware,categoryController.getAll)

module.exports=router