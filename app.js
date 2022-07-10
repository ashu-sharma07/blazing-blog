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

// Render Blogpost on homepage

app.get("/", function (req, res) {
  Blogpost.find((err, foundPost) => {
    if (!err) {
      res.render("home", {
        blogPosts: foundPost,
      });
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
  const myblogpost = new Blogpost({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
  });
  myblogpost.save();
  res.redirect("/compose");
});

// Render blogPost pages

app.get("/posts/:postName", function (req, res) {
  const urlEntered = req.params.postName.trim();
  console.log(urlEntered);
  Blogpost.find({}, (err, foundPost)=>{
    console.log(foundPost);
  });
  res.render("404");
});

app.get("/:nonsense", function(req, res){
  res.render("404");
});


// Listening for HTTPs request on the specific port

const port = 3000;

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

// this is so cool boi 