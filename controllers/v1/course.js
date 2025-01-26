const courseModel = require("./../../models/course");
const sesstionModel = require('./../../models/session')
const userCourseModel = require('./../../models/course-user')
const categoryModel = require('./../../models/category');
const commentModel = require('./../../models/comment')
const { default: mongoose } = require("mongoose");
const { rawListeners } = require("../../models/user");


exports.create = async (req, res) => {
  const {
    name,
    description,
    support,
    href,
    price,
    status,
    discount,
    categoryID,
  } = req.body;

  const course = await courseModel.create({
    name,
    description,
    creator: req.user._id,
    categoryID,
    support,
    price,
    href,
    status,
    discount,
    cover: req.file.filename,
  });

  const mainCourse = await courseModel
    .findById(course._id)
    .populate("creator", "-password");

  return res.status(201).json(mainCourse);
};


exports.createSession = async (req, res) => {
  const { title, time, free } = req.body
  const courseID = req.params.id


  const session = await sesstionModel.create({
    title,
    time,
    free,
    video: req.file.filename,
    course: courseID

  })
  return res.json(201).json(session)
}


exports.getAllSessions = async (req, res) => {

  const allSessions = await sesstionModel.find({}).populate('course', 'title')
  return res.status(200).json(allSessions)
}


exports.getSessionInfo = async (req, res) => {

  const courese = await courseModel.find({ href: req.params.href })
  const session = await sesstionModel.find({ _id: req.params.sessionID })
  const sessions = await sesstionModel.find({ course: courese._id })

  return res.status(200).json({ session, sessions })

}


exports.removeSession = async (req, res) => {
  const { id } = req.params.id

  const deltedSession = await sesstionModel.findOneAndDelete({ _id: id })
  if (!deltedSession) {
    return res.status(404).json({ message: "sesstion not fount" })
  }

  return res.json(deltedSession)
}



exports.register = async (req, res) => {

  const isUserRegisted = await userCourseModel.findOne({
    user: req.user._id,
    course: req.params.id
  })

  if (isUserRegisted) {
    return res.status(404).json({ message: 'you are already registed this course' })
  }

  const userCourse = await userCourseModel.create({
    course: req.params.id,
    user: req.user._id,
    price: req.body.price
  })
  return res.status(201).json(userCourse)





}


// find by category course

// Controller function to get courses by category
exports.getCourseByCategory = async (req, res) => {
  const { href } = req.params;  // Extract href from URL parameters
  if (!mongoose.isValidObjectId(href)) {
    return res.json({ message: 'itis is not objecy id' })
  }
  try {
    // Find the category by href (string)
    const category = await categoryModel.findOne({ href });

    // If category is not found, return a 404 error
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Use the category's _id to find courses
    const categoryCourses = await courseModel.find({
      categoryID: category._id,  // Query courses using the category's ObjectId
    });

    // Return the courses found for the category
    return res.status(200).json(categoryCourses);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




// get single course

exports.getOne = async (req, res) => {

  const { href } = req.params
  const course = await courseModel.findOne({ href }).populate('creator', '-password').populate('categoryID').lean();

  const sessions = await sesstionModel.find({ course: course._id })
  const comments = await commentModel.find({ course: course._id, isAccept: 1 })
    .populate('creator', '-password').populate('course').lean()



  let isUserRegisteredToThisCourse = false
  isUserRegisteredToThisCourse = await courseModel.findOne({

    user: req.user._id,
    course: course._id,
  });



  let allComments=[]
  comments.forEach(comment => {   //it iterate once 
  
    comments.forEach(answerComment=>{  //iterate in all comments

      if(String(comment._id)===String(answerComment.mainCommentID)){
          
        allComments.push({
          ...comment,
          course:comment.course.name,
          creator:comment.creator.name,
          answerComment

        })
      }

    })

  });



  res.status(200).json({ course, sessions, comments:allComments, isUserRegisteredToThisCourse })
}




// remove courese
exports.removeCourse = async (req, res) => {


  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.json({ message: 'this is not valid objectID' })
  }

  const deletedCourse = await courseModel.findOneAndDelete({ _id: req.params.id });


  return res.status(200).json({ deletedCourse })

}


// find related course 
exports.relatedCourse = async (req, res) => {
  const { href } = req.params
  const course = await courseModel.findOne({ href })

  const relatedCourse = await courseModel.find({ categoryID: course.categoryID })


  const relatedCourses = relatedCourse.filter(course => {
    course.href !== href
  })


  return res.status(200).json({ course, relatedCourses})
}