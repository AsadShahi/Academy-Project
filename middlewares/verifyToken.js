const jwt= require('jsonwebtoken')
require('dotenv').config()

const verifyToken=async(req,res,next)=>{
    const authHeader=req.headers['authorization']

    const token= authHeader.split(' ')[1]

    if(token){

        try {

            const accessTokenPayload=jwt.verify(token,process.env.AccessTokenSecretKey)
             req.email= accessTokenPayload.email

            next()
            
        } catch (error) {

            return res.json({message:'your token is expired'})
        }


    }else{
        return res.status(401).json({message:'you are not allow to this routes'})
    }
}

module.exports=verifyToken