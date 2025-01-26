const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser= require('cookie-parser')
const authRouter = require("./routes/v1/auth");
const usersRouter = require("./routes/v1/user");
const categoryRouter= require('./routes/v1/category')
const courseRouter= require('./routes/v1/course')
const commentRouter=require('./routes/v1/comment')
const contactRouter=require('./routes/v1/contact')
const searchRouter= require('./routes/v1/search')
const menusRouter= require('./routes/v1/menu')

const app = express();

app.use(cookieParser());

app.use(
  "/courses/covers",
  express.static(path.join(__dirname, "public", "courses", "covers"))
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/v1/auth", authRouter);
app.use('/v1/users',usersRouter);


app.use("/v1/category",categoryRouter);
app.use("/v1/courses",courseRouter);
app.use("/v1/comments",commentRouter);
app.use("/v1/contacts",contactRouter);
app.use("/v1/searchs",searchRouter);
app.use("/v1/menus",menusRouter);



module.exports = app;
