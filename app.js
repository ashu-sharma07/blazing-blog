// Importing required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();

// Seting up app.js
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database Integration

const databaseUrl = "mongodb://localhost:27017/blogpostDB";
mongoose.connect(databaseUrl);

// Schema for blogPost

const postSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String,
});

// Create blogPost collection Model

const Blogpost = mongoose.model("Blogpost", postSchema);

// Creating sample blog post

const blogpost1 = new Blogpost({
  postTitle: "Day 1",
  postContent:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
});

const blogpost2 = new Blogpost({
  postTitle: "Day 2",
  postContent:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
});

const defaultPosts = [blogpost1, blogpost2];

function insertDefaultpost() {
  Blogpost.insertMany(defaultPosts, (err) => {
    if (!err) {
      console.log("Successfully add default post to the data base");
    } else {
      console.log(err);
    }
  });
}

// Render Blogpost on homepage

app.get("/", function (req, res) {
  Blogpost.find((err, foundPost) => {
    if (!err) {
      if(foundPost.length===0){
        insertDefaultpost();
        res.redirect("/");
      }
      else{
        res.render("home", {
          blogPosts: foundPost,
        });
      }
    } else {
      console.log(err);
    }
  });
});

// Render Contact Page

app.get("/contact", function (req, res) {
  res.render("contact");
});

// Render About Page

app.get("/about", function (req, res) {
  res.render("about");
});

// Render Compose Page

app.get("/compose", function (req, res) {
  res.render("compose");
});

// Add blogPost to Database

app.post("/compose", function (req, res) {
  const blogPost = {
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
  };
  blogPosts.push(blogPost);
  res.redirect("/");
});

// Render blogPost pages

app.get("/posts/:postName", function (req, res) {
  const urlEntered = _.lowerCase(req.params.postName);
  let notPageFound = true;
  blogPosts.forEach((blogPost) => {
    let blogPostTitle = _.lowerCase(blogPost.postTitle);
    if (blogPostTitle === urlEntered) {
      // console.log("Match Found");
      res.render("post", { blogPost: blogPost });
      notPageFound = false;
      return 0;
    }
  });
  if (notPageFound) {
    res.render("404");
  }
});

// Listening for HTTPs request on the specific port

const port = 3000;

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
