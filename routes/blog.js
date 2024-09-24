const { Router } = require("express");
const Blog = require("../models/blog")
const Comment = require("../models/comment")
const multer  = require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public/uploads"))
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()} - ${file.originalname}`
    cb(null, name)
  }
})

const upload = multer({ storage: storage })

const router = Router();

router.get("/add-blog", (req, res) => {
  res.render("addBlog", {
    logo: "/images/the-blog-logo.png",
    user: req.user,
  });
});

router.post("/add-blog" , upload.single('bannerImage'), async (req, res) => {
  const {blogTitle,content} =  req.body

  console.log(req.file);
  
   let blog = await Blog.create({
    blogTitle,
    content,
    bannerImage:`/uploads/${req.file.filename}`,
    createdBy:req.user._id
   })

   res.redirect(`/blog/${blog._id}`)

});

router.get("/:blogId", async (req, res) => {
  let id = req.params.blogId
  let blog = await Blog.findById({_id:id}).populate("createdBy")
  let allComments = await Comment.find({blogId:id}).populate("commentedBy")

  res.render("blog" , {
    blog,
    logo: "/images/the-blog-logo.png",
    user: req.user,
    comments:allComments,
  })

});

router.post("/comment/:blogId", async (req, res) => {
    const {content} = req.body
  let comment = await Comment.create({
     content,
     blogId:req.params.blogId,
     commentedBy:req.user._id
  })

  res.redirect(`/blog/${req.params.blogId}`)

});

module.exports = router;
