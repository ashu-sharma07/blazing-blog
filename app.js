// Importing required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();

let blogPosts = [];

// Seting up app.js
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Render Blogpost on homepage

app.get("/", function (req, res) {
  res.render("home", {
    blogPosts: blogPosts,
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
