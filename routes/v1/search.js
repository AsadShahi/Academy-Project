const express= require('express')
const router= express.Router()

const searchController= require('./../../controllers/v1/search')

router.route('/:keyword').get(searchController.search)

module.exports=router