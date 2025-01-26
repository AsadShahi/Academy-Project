const userModel = require("../../models/user");
const banPhoenModel =require('../../models/ban-phone');
const { default: mongoose } = require("mongoose");
const bcrypt= require('bcrypt')
exports.banUser=async(req,res)=>{




    const mainUser= await userModel.findOne({_id:req.params.id}).lean();
    if(!mainUser){
        return res.status(404).json({message:'user not found'})
    }
    const phoneUser=mainUser.phone

    const banUser= await banPhoenModel.create({phone:phoneUser})


    if(banUser){
        return res.status(200).json({message:'user successfully Banned'})
    }
    return res.status(500).json({message:'internal server error'})

    

}

exports.getAll=async(req,res)=>{
    const users=await userModel.find({}).lean()
    return res.status(200).json({users})
}

exports.removeUser=async(req,res)=>{
    const isVlidObjectID= mongoose.Types.ObjectId.isValid(req.params.id)
    if(!isVlidObjectID){
        return res.json({message:"it is not valid object id"})
    }

    await userModel.findOneAndDelete({_id:req.params.id})
    return res.status(200).json({message:"user successfully deleted"})
}



exports.changeRole=async(req,res)=>{
    const {id}=req.body

    const isVlidObjectID= mongoose.Types.ObjectId.isValid(id)
    if(!isVlidObjectID){
        return res.json({message:"it is not valid object id"})
    }


    const user= await userModel.findOne({_id:id})

    const newRole= user.role === "USER"?"ADMIN":"USER"

    const updateUser= await userModel.findOneAndUpdate({_id:id},
        {
            role:newRole
        }
    )
    if(updateUser){
        return res.status(200).json({message:"user role success changed "})
    }



}

exports.updateInfo=async(req,res)=>{
    const {name,username,password,email}=req.body


    const hashedpassword=await bcrypt.hash(password,10)

    const user= await userModel.findOne({
        _id:req.user._id
    })

    const userUpdate= await userModel.findByIdAndUpdate({_id:user._id},
        {
            name,
            username,
            email,
            password:hashedpassword
        }
    ).select('_password').lean()


    if(userUpdate){
        return res.status(200).json({message:'infos successfully updated'})
    }

}