const { clear } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const { db } = require('./models/customer');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public')); // access images, css, js
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const Customer = require('./models/customer');
const Product = require('./models/product');

let currentUser = "5f755cafa0381c467432605b"; // Will track the user that is logged in

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

  customer.save()
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
});

// This is an example of how to add a new field to the db with a value
// If you do, make sure to update the schema first in the models folder

// Ex. This customer did not have totalSpent. Eduardo added to the schema first.
// Then used this command to add the new field to the db witht he new value.
app.get('/new-field', function (req, res) {
  Customer.updateOne({ firstName: "Eduardos" }, {$set: { totalSpent: "15.00" }})
  .then((result) => {
    res.send(result);
  }).catch((error) => {
    console.log(error);
  });

});

app.get('/update-customer', function (req, res) {
  Customer.updateOne({ firstName: "Eduardo" }, {totalSpent: "12.55"})
  .then((result) => {
    res.send(result);
  }).catch((error) => {
    console.log(error);
  });

});

function getName(result) {
  console.log(result.lastName);
}

function getPass(result) {
  console.log(result.password);
}


app.get('/', function (_req, res) {

  // some quick example, will get from DB
  var movie_info = [
    {movie: "1918", date: "08/15/20", tag_1: "lame"},
    {movie: "some other movie", date: "09/02/00", tag_1: "exciting"},
    {movie: "last movie idk", date: "12/31/20", tag_1: "i dont know man" }
  ]

  res.render('home', {
    Username: 'guest',
    Movie: movie_info,
  });
});

app.get('/create_account', function(req, res) {
  res.render('create_account', {
    Username: 'guest'
  });
});

app.get('/login', function (req, res) {
  // res.render("index.ejs");
  res.render('login', {
    Username: 'guest'
  });
}); //root

app.get('/cart', function (req, res) {
  // res.render("index.ejs");
  res.send('It works recent!');
}); //root

app.get('/shop', function (req, res) {
  // res.render("index.ejs");
  res.send('implement shopping cart!');
}); //root

app.get('/profile', function (req, res) {
  const id = currentUser;
  if (id != "") {
    Customer.findById(id)
    .then((result) => {
      res.render("profile", {
        Username: result.username,
        UserInfo: result
      });
    })
    .catch((err) => {
      console.log(err);
    })
  } else {
    res.redirect('/');
  }


  // res.send('It works recent!');
}); //root

//running server
// app.listen(3000, function(){
//   console.log("Express server is running...");
// });

// -----------------------------------
