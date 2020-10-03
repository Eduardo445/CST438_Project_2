const { clear } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public')); // access images, css, js
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const Customer = require('./models/customer');
const Product = require('./models/product');
// Will track the user that is logged in
let currentUser;

// Connect to mongodb
const uri = 'mongodb+srv://Esoto1290:CSTwebstore1900@cst438.vwxeq.mongodb.net/WebStore?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(process.env.PORT || 3000, function() {
    console.log("Express server is running...");
    console.log(this.address().port);
  }))
  .catch((err) => console.log(err));

app.get("/add-customer", (req, res) => {

  const customer = new Customer({
    firstName: 'Eduardos',
    lastName: 'Soto',
    username: 'Test',
    password: 'count#',
  });

  customer
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/addMovies', (req, res) => {
  const product = new Product({
    name: "Spirited Away",
    price: "25.00",
    release: "2001-07-20",
    categories: ["Animation", "Adventure", "Family", "Fantasy", "Mystery"],
    stock: 20,
    poster: "./public/img/spirited_away.jpg",
    description: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    summary: "A young girl, Chihiro, becomes trapped...",
  });

  product.save().then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  })
  
});

app.get('/all-customers', (req, res) => {
  Customer.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/single-customer', (req, res) => {
  Customer.findById('5f755cafa0381c467432605b')
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/customer-firstname', (req, res) => {
  
  addNum();
  
  Customer.findOne({ firstName: 'Eduardo' })
    .then((result) => {
      res.send(result);
      // console.log(result);
      currentUser = result;
      getName(result);
      getPass(result);
      console.log(currentUser.firstName);
    })
    .catch((err) => {
      console.log(err);
    });

    addNum();
    console.log(subNum());
});

function getName(result) {
  console.log(result.lastName);
}

function getPass(result) {
  console.log(result.password);
}


app.get('/', function (_req, res) {
  res.render('home', {
    Title: 'Store Landing Page',
    Username: 'guest'
  });
}); //root

app.get('/create_account', function(req, res) {
  res.send('implement create account')
})

app.get('/login', function (req, res) {
  // res.render("index.ejs");
  res.send('It works adware!');
}); //root

app.get('/shop', function (req, res) {
  // res.render("index.ejs");
  res.send('It works recent!');
}); //root

app.get('/cart', function (req, res) {
  // res.render("index.ejs");
  res.send('It works recent!');
}); //root

app.get('/profile', function (req, res) {
  // res.render("index.ejs");
  res.send('It works recent!');
}); //root

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
