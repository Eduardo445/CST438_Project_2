const { clear } = require('console');
const express = require('express');
const { getUnpackedSettings } = require('http2');
const { url } = require('inspector');
const mongoose = require('mongoose');
const app = express();

// Register view engine
app.set('view engine', 'ejs');

// Middleware & Static Files
app.use(express.static('public')); // access images, css, js
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Express-Session
var session = require('express-session');
app.use(session({ 
  secret: "Crazy Green",
  rolling: true,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 5
  }
}));

// Avoid deprecated warning for findByIdAndUpdate()
mongoose.set('useFindAndModify', false); 

// Mongoose-Currency (if needed here, else cut it in the end)
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// Models from our Database
const Customer = require('./models/customer');
const Product = require('./models/product');

// Will track the user that is logged in
let currentUser = ""; 

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

// Start of our Routes
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

app.get('/login', function (req, res) {
  res.render('login', {
    Username: 'Guest',
    Valid: true
  });
});

app.post('/login', function (req, res) {
  user = req.body.username;
  password = req.body.password;

  
  Customer.findOne({ username: req.body.username })
    .then((result) => {
      if(result == null){
        res.render('login', {
          Username: 'Guest',
          Valid: false
        });
      }
      else if (user == result.username && password == result.password){
        res.redirect('/');
      }
      else{
        res.render('login', {
          Username: 'Guest',
          Valid: false
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/create_account', function (req, res) {
  res.render('create_account', {
    Username: 'guest',
    taken: false
  });
});

app.post('/create_account', function (req, res) {

  user = req.body.username;
  password = req.body.password;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  Customer.findOne({ username: req.body.username })
    .then((result) => {
      if(result == null){
        var newcust = new Customer();
        newcust.username = user;
        newcust.password = password;
        newcust.firstName = first_name;
        newcust.lastName = last_name;
        newcust.totalSpent = 0;

        newcust.save(function(error, savedUder){
          if(error) {
            console.log(error);
            return res.status(500).send();
          }
          console.log("user added successfully")
        });
        res.redirect('/login');
      }
      else if (user == result.username){
        res.render('create_account', {
            Username: 'guest',
            taken: true
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });

    // if(found){
    //   res.render('create_account', {
    //     Username: 'guest',
    //     taken: true
    //   });
    // }
    // if(!found){
    //   var newcust = new Customer();
    //   newcust.username = user;
    //   newcust.password = password;
    //   newcust.firstName = first_name;
    //   newcust.lastName = last_name;
    //   newcust.totalSpent = 0;

    //   newcust.save(function(error, savedUder){
    //     if(error) {
    //       console.log(error);
    //       return res.status(500).send();
    //     }
    //     console.log("user added successfully")
    //   });
    //   res.redirect('/login');
    // }
});

app.get('/cart', function (req, res) {
  // res.render("index.ejs");
  res.send('It works recent!');
}); //root

app.get('/shop', function (req, res) {
  // res.render("index.ejs");
  res.send('implement shopping cart!');
}); //root

/**
 * Anything Below this comment is a working route page.
 * Any of the above routers are working examples for ideas on how to use.
 */

 function activeUser(req) {
   if (!req.session.authenticated) {
     currentUser = "";
   }
 } // Checks for user inactivity

app.get('/', function (req, res) {
  activeUser(req);
  var id = currentUser;
  if (id == '') {
    console.log('no username')
    getMovies(res, 'Guest');
  } else {
    Customer.findById(id).then((result) => {
      getMovies(res, result.username);
    }).catch((error) => {
      console.log(error)
    })
  }
}); // Home page

function getMovies(res, person) {
  Product.find()
  .then((result) => {
    var movie_names = [];
    result.forEach(function (movie_name) {
      movie_names.push(movie_name.name);
    });

    res.render('home', {
      Username: person,
      MovieObject: result,
      MovieNames: movie_names,
    });
  })
  .catch((err) => {
    console.log(err);
  });
}  // Get movies from DB

app.get('/search', function(req, res) {
  activeUser(req);

  var id = currentUser
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

  var search = replaceAll(req._parsedUrl.query, {'%20': ' '})
  Product.find({name: RegExp(search, 'gi') }).then((result) => {
    console.log(result)
    res.render('search_product', {
      Username: id,
      Search: search,
      Movie: result
    })
  })
})

// replaces values that are put in given map
function replaceAll(string, mapObj) {
  var regex = new RegExp(Object.keys(mapObj).join("|"),"gi");
  return string.replace(regex, function(matched) {
      return mapObj[matched.toLowerCase()];
  });
}

app.get('/get_movie', function(req, res) {

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

  var product_query = req._parsedUrl.query

  Product.findById(product_query)
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

 // Login Page

app.post('/check', function(req, res) {
  Customer.findOne({ username: req.body.username, password: req.body.password })
  .then((result) => {
    currentUser = result.id;
    req.session.authenticated = true;
    res.send({ "check": true });
  })
  .catch((error) => {
    console.log(error);
    res.send(false);
  });
}); // Login checking process

app.get("/logout", function(req, res){
  if (currentUser != "") {
    currentUser = "";
    req.session.destroy();
    res.redirect('/');
  }
}); // Log the user out

app.get('/profile', function (req, res) {
  activeUser(req);
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

app.get('/profile/update/:id', function (req, res) {
  activeUser(req);
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
}); // Update User's Profile Page

app.put('/profile/update/:id', (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "") {
    Customer.findByIdAndUpdate(currentUser, {
      firstName: req.body.first,
      lastName: req.body.last,
      username: req.body.user,
      password: req.body.pass
    })
    .then((result) => {
      res.redirect('/profile');
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    res.redirect('/');
  }
}); // Updates database with new changes