const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog")

const { connectToMongoDb } = require("./connection");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const { checkForAuthentication } = require("./middlewares/auth");

const app = express();
const PORT = 8005;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(checkForAuthentication("token"));

connectToMongoDb("mongodb://localhost:27017/The-blog-db")
  .then(() => console.log("mongodb connected!"))
  .catch((err) => console.log("err", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({})
  res.render("home", {
    logo: "/images/the-blog-logo.png",
    user: req.user,
    blogs:allBlogs,
  });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
