const { Schema, model } = require("mongoose");

const blogSchema = new Schema({

  blogTitle: {
    type: String,
    required: true,
  },
  content:{
    type: String,
    required: true,
  },
  bannerImage:{
    type: String,
    require:false
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"user"
  }

});

const Blog = model("blog", blogSchema);

module.exports = Blog
