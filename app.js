

const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const ejs = require("ejs");
const _ = require("lodash");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to parse JSON bodies
app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

//let posts = [];

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

post.save();
  //posts.push(post);

  res.redirect("/");

});



app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
         title: post.title,
         content: post.content
  });
});
});

app.get("/api/posts", function (req, res) {
  Post.find({}, function (err, posts) {
    res.json(posts);
  });
});

// Get a specific post by ID
// app.post("/api/posts/getById", function (req, res) {
//   const requestedPostId = req.body.id;

//   if (!mongoose.isValidObjectId(requestedPostId)) {
//     return res.status(400).json({ error: "Invalid post ID" });
//   }

//   Post.findOne({ _id: requestedPostId }, function (err, post) {
//     if (err) {
//       console.error("Error retrieving post:", err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     if (post) {
//       res.json(post);
//     } else {
//       res.status(404).json({ error: "Post not found" });
//     }
//   });
// });




// // Create a new post
// // Create a new post
// app.post("/api/posts", function (req, res) {
//   // console.log("Received request body:", req.body);

//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content
//   });

//   post.save(function (err, savedPost) {
//     if (err) {
//       console.error("Error saving post:", err);
//       res.status(500).json({ error: "Error creating post" });
//     } else {
//       res.status(201).json({
//         message: "Post created successfully",
//         post: savedPost
//       });
//     }
//   });
// });



app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
