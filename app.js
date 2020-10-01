<<<<<<< HEAD
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var stylus = require("stylus");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
=======
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); // access images, css, js

const Customer = require('./models/customer');
// const MongoClient = require("mongodb").MongoClient;

let currentUser;

// Connect to mongodb
const uri = 'mongodb+srv://Esoto1290:CSTwebstore1900@cst438.vwxeq.mongodb.net/WebStore?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000, function() {
      console.log("Express server is running...");
    }))
    .catch((err) => console.log(err));

app.get("/add-customer", (req, res) => {

  const customer = new Customer({
    firstName: 'Eduardos',
    lastName:  "Soto",
    username:  "Test",
    password:  "count#"
  });

  customer.save().then((result) => {
    res.send(result);
  }).catch((err) => {
    console.log(err);
  });

})

app.get("/all-customers", (req, res) => {
  Customer.find().then((result) => {
    res.send(result);
  }).catch((err) => {
    console.log(err);
  });
});

app.get("/single-customer", (req, res) => {
  Customer.findById("5f755cafa0381c467432605b").then((result) => {
    res.send(result);
  }).catch((err) => {
    console.log(err);
  });
})

app.get("/customer-firstname", (req, res) => {
  Customer.findOne({ firstName: "Eduardo" }).then((result) => {
    res.send(result);
    console.log(result);
    currentUser = result;
    getName(result);
    getPass(result);
    console.log(currentUser.firstName);
  }).catch((err) => {
    console.log(err);
  });

  
>>>>>>> Eduardo
});

function getName(result) {
  console.log(result.lastName);
}

function getPass(result) {
  console.log(result.password);
}

app.get("/", function(req, res){
    // res.render("index.ejs");
    res.render("profile", {
      "Title": "Testing"
    });
});//root

app.get("/login", function(req, res){
  // res.render("index.ejs");
  res.send("It works adware!");
});//root

app.get("/sign", function(req, res){
  // res.render("index.ejs");
  res.send("It works ransom!");
});//root

app.get("/shop", function(req, res){
  // res.render("index.ejs");
  res.send("It works recent!");
});//root

app.get("/cart", function(req, res){
  // res.render("index.ejs");
  res.send("It works recent!");
});//root

app.get("/profile", function(req, res){
  // res.render("index.ejs");
  res.send("It works recent!");
});//root

//running server
// app.listen(3000, function(){
//   console.log("Express server is running...");
// });

// -----------------------------------

// const client = new MongoClient(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//   const collection = client.db("WebStore").collection("Customers");
//   // perform actions on the collection object
//   client.close();
// });

// client.connect().then(result => {
//     const database = client.db("WebStore");
//     const collection = database.collection("Customers");
//     console.log(result);
// }, error => {
//     console.error(error);
// });

// (async () => {
//     try {
//         await client.connect();
//         const database = client.db("WebStore");
//         const collection = database.collection("Customers");
//         const result = await collection.insertOne({
//             "firstName": "Eduardo",
//             "lastName" : "Soto",
//             "username" : "Testing",
//             "password" : "Admin!"
//         });
//         console.log(result.insertId);
//         client.close();
//     } catch (err) {
//         console.error(err);
//     }
    
// })();

// const request = require('request');