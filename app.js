const { clear } = require('console');
const express = require('express');
const { getUnpackedSettings } = require('http2');
const { url } = require('inspector');
const mongoose = require('mongoose');
const { db } = require('./models/customer');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public')); // access images, css, js
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const Customer = require('./models/customer');
const Product = require('./models/product');

let currentUser = '5f755cafa0381c467432605b'; // Will track the user that is logged in

// Connect to mongodb
const uri = 'mongodb+srv://Esoto1290:CSTwebstore1900@cst438.vwxeq.mongodb.net/WebStore?retryWrites=true&w=majority';

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(process.env.PORT || 3000, function () {
      console.log('Express server is running...');
      console.log(this.address().port);
    })
  )
  .catch((err) => console.log(err));

app.get('/add-customer', (req, res) => {
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
    name: "Parasite",
    price: "20.00",
    release: "2019-05-30",
    categories: ["Comedy", "Drama", "Thriller"],
    stock: 20,
    poster: "img/parasite.jpg",
    description: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    summary: "All unemployed, Ki-taek's family takes peculiar...",
});

  product
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/all-customers', (req, res) => {
  Product.find()
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
  Customer.updateOne(
    { firstName: 'Eduardos' },
    { $set: { totalSpent: '15.00' } }
  )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/update-customer', function (req, res) {
  Customer.updateOne({ firstName: 'Eduardo' }, { totalSpent: '12.55' })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
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

  var id = currentUser;
  if (id == '') {
    console.log('no username')
    id = 'Guest'
  } else {
    Customer.findById(id).then((result) => {
      id = result.username
    }).catch((error) => {
      console.log(error)
    })
  }

  // get movies from DB
  Product.find()
    .then((result) => {
      var movie_names = [];
      result.forEach(function (movie_name) {
        movie_names.push(movie_name.name);
      });

      res.render('home', {
        Username: id,
        MovieObject: result,
        MovieNames: movie_names,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/search', function(req, res) {

  var id = currentUser;
  if (id == '') {
    console.log('no username')
    id = 'Guest'
  } else {
    Customer.findById(id).then((result) => {
      id = result.username
    }).catch((error) => {
      console.log(error)
    })
  }

  var url = req._parsedUrl.query

  Product.findById(url)
    .then((result) => {
      res.render('product_details', {
        Movie: result,
        Username: id
      })

    }).catch((error) => {
      console.log(error)
      res.redirect('/')
    });

});

app.get('/create_account', function (req, res) {
  res.render('create_account', {
    Username: 'guest',
  });
});

app.get('/login', function (req, res) {
  // res.render("index.ejs");
  res.render('login', {
    Username: 'guest',
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
  if (id != '') {
    Customer.findById(id)
      .then((result) => {
        res.render('profile', {
          Username: result.username,
          UserInfo: result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/');
  }
}); // User Profile Page

app.get('/updateUser', function (req, res) {
  const id = currentUser;
  if (id != "") {
    Customer.findById(id)
    .then((result) => {
      res.render("update_profile", {
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
}); // User Profile Page
