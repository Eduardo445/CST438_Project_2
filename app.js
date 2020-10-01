const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); // access images, css, js

// const MongoClient = require("mongodb").MongoClient;

// Connect to mongodb
const uri = 'mongodb+srv://Esoto1290:CSTwebstore1900@cst438.vwxeq.mongodb.net/WebStore?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

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

app.get("/", function(req, res){
    // res.render("index.ejs");
    res.send("It works!");
});//root

//running server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});