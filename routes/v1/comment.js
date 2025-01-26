const express= require('express')
const router= express.Router()
const isUserMiddleware= require('./../../middlewares/auth')
const isAdminMiddleware= require('./../../middlewares/isAdmin')
const commentController= require('./../../controllers/v1/comment')

  router.route('/').post(isUserMiddleware,commentController.create)
  router.route('/:id').delete(isUserMiddleware,commentController.removeComment)


  // accept and reject the comment
  router.route('/:id/accept').put(isUserMiddleware,isAdminMiddleware,commentController.accept)
  router.route('/:id/reject').put(isUserMiddleware,isAdminMiddleware,commentController.reject)

  
  // reply or answer the comment user
  router.route('/:id/answer').post(isUserMiddleware,isAdminMiddleware,commentController.answer)


module.exports=router