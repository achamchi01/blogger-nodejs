const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const Blog = require("./models/blog");
const { render } = require("ejs");

const app = express();

const dbURI =
  "mongodb+srv://achamchi:Ayoub123@cluster0.cmn06nv.mongodb.net/sample_training?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => app.listen("3000"))
  .catch((err) => console.log("error connecting to db: " + err));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

app.get("/blogs", (req, res) => {
  Blog.find().sort({createdAt: -1})
    .then((blogs) => {
      res.render("index", { title: "Home", blogs });
    })
    .catch((err) => console.log(err));
});

app.post('/blogs', (req, res)=> {
    const blog = new Blog(req.body);

    blog.save()
    .then(() => {
        res.redirect("/blogs");
    })
    .catch((err) => console.log(err));
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id
    Blog.findById(id)
    .then((blog) => {
        res.render("details", {blog, title: "Blog details"})
    })
    .catch((err) => console.log(err));
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id
    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect: '/blogs'})
    })
    .catch((err) => console.log(err));
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "create new blog" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
