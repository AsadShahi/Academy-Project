const jwt=require('jsonwebtoken')
require('dotenv').config()

const genrateAccessToken= (email)=>{

    const token = jwt.sign({email}, process.env.AccessTokenSecretKey, {
        expiresIn: "20s",
      });
      return token;
}


const generateRefreshToken=(email)=>{

    const token = jwt.sign({ email }, process.env.RefreshTokenSecretKey, {
        expiresIn: "30d",
      });
      return token;
}


module.exports={genrateAccessToken,generateRefreshToken}