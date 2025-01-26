const courseModel= require('./../../models/course')


exports.search=async(req,res)=>{
    const {keyword}= req.params
    
 
    const findCourse = await courseModel.find({
        name: { $regex: '.*' + keyword + '.*', $options: 'i' } // Optionally, you can add the 'i' flag for case-insensitive search
    });
    if(!findCourse){
        return res.status(404).json({message:'not found'})
    }

    return res.status(200).json(findCourse)

}