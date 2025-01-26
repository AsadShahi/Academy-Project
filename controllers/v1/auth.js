const userModel = require("../../models/user");
const banPhoenModel = require('../../models/ban-phone')

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerValidator = require("./../../validators/register");
const { genrateAccessToken } = require("../../utils/auth");
const { generateRefreshToken } = require("../../utils/auth");

exports.register = async (req, res) => {

  const { username, name, email, password, phone } = req.body;

  const validationResult = registerValidator(req.body);

  if (validationResult != true) {
    return res.status(422).json(validationResult);
  }


  const banuser = await banPhoenModel.find({ phone: phone })

  if (banuser.length) {
    return res.json({ message: 'You are banned' })
  }

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(409).json({
      message: "username or email is duplicated",
    });
  }

  const countOfUsers = await userModel.find({});

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name,
    email,
    username,
    phone,
    password: hashedPassword,
    role: countOfUsers.length > 0 ? "USER" : "ADMIN",
  });

  const userObject = user.toObject();
  Reflect.deleteProperty(userObject, "password");


  const AccessToken = genrateAccessToken(email)
  const RefreshToken = generateRefreshToken(email)

  return res.status(201).json({ user: userObject, AccessToken, RefreshToken });

  // Coding
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return res.status(401).json({
      message: "There is no user with this email or username",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Password in not valid !!",
    });
  }

  const AccessToken = genrateAccessToken(user.email)
  const RefreshToken = generateRefreshToken(user.email)


  // update refresh token

  const userUpdateRefresh=await userModel.findOneAndUpdate({email: identifier }, {
    $set: { refreshToken: RefreshToken }
  })


  if(!userUpdateRefresh){
    return res.status(200).json({message:"not updated"})
  }


  res.cookie('acces-token', AccessToken, {
    httpOnly: true
  })


  res.cookie('refresh-token', RefreshToken, {
    httpOnly: true
  })


  return res.json({ message: 'user login successfully!!', AccessToken, RefreshToken });
};





exports.refreshToken = async (req, res) => {

  try {


    const refreshToken = req.cookies['refresh-token']

    if (!refreshToken) {
      return res.status(401).json({ message: "you have no refresh token " })
    }
    const user = await userModel.findOne({ refreshToken:refreshToken })

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token or user not found" });
    }

    jwt.verify(refreshToken, process.env.RefreshTokenSecretKey)


    const newAccesstoken = genrateAccessToken(user.email)


    res.cookie('access-token',newAccesstoken,{httpOnly:true})

    return res.status(200).json({ message: newAccesstoken })


  } catch (err) {
    return res.json({ message: err.message })
  }
}


exports.getMe = async (req, res) => { };
