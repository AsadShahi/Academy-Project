const commentModel = require("./../../models/comment");
const courseModel = require("./../../models/course");

exports.create = async (req, res) => {
  const { body, courseHref, score } = req.body;

  const course = await courseModel.findOne({ href: courseHref }).lean();
   if(!course){
    return res.status(404).json({message:'not fount course'})
   }

   
  const comment = await commentModel.create({
    body,
    course: course._id,
    creator: req.user._id,
    score,
    isAnswer: 0,
    isAccept: 0, // 1 => show as public
  });

  return res.status(201).json(comment);
};

exports.removeComment=async(req,res)=>{

  const delededComment= await commentModel.findOneAndDelete({_id:req.params.id});
  
  if(!delededComment){
    return res.status(404).json({message:'comment not found'})
  }

  return res.status(200).json({message:'comment deleted successfully',delededComment})

}

exports.accept=async(req,res)=>{
  const updateAcceptComment= await commentModel.findOneAndUpdate({_id:req.params.id},{isAccept:1})

  if(!updateAcceptComment){
    return res.status(404).json({message:'comment not found'})
  }

  return res.status(200).json({message:'comment accepted successfully'})

}

exports.reject=async(req,res)=>{
  const updateRejectComment= await commentModel.findOneAndUpdate({_id:req.params.id},{isAccept:0})

  if(!updateRejectComment){
    return res.status(404).json({message:'comment not found'})
  }

  return res.status(200).json({message:'comment rejected successfully'})

}


// reply to any comments

exports.answer= async(req,res)=>{
  const {body}=req.body
  const acceptComment= await commentModel.findOneAndUpdate({_id:req.params.id},{isAccept:1}).lean();

  const answerComment= await commentModel.create({
    body,
    course: acceptComment.course,
    creator: req.user._id,
   
    isAnswer: 1,
    isAccept: 1, // 1 => show as public
    mainCommentID:req.params.id
  })

  return res.status(201).json({message:'comment answed successfully',answerComment})

}