const { clear } = require('console');
const express = require('express');
const { getUnpackedSettings } = require('http2');
const { url } = require('inspector');
const mongoose = require('mongoose');
const app = express();

// Promises
const Promise = require('bluebird');
mongoose.Promise = Promise;

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

// Models from our Database
const Customer = require('./models/customer');
const Product = require('./models/product');
const Cart = require('./models/cart');

// Will track the user that is logged in
let currentUser = "";
let guestName = 'Guest';

// Track the user's cart, subtotal, and purchase
let cartItems = [];
let inventoryChanges = [];
let subTotal = 0;
let transaction = false;

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

/**
 * Anything Below this comment is a working route page.
 * Any of the above routers are working examples for ideas on how to use.
 */

 function activeUser(req) {
   if (!req.session.authenticated) {
     currentUser = "";
     cartItems = [];
     guestName = 'Guest';
     subTotal = 0;
   }
 } // Checks for user inactivity

app.get('/', function (req, res) {
  activeUser(req);
  Product.find().limit(10)
  .then((result) => {
    var movie_names = [];
    result.forEach(function (movie_name) {
      movie_names.push(movie_name.name);
    });

    res.render('home', {
      Username: guestName,
      MovieObject: result,
      MovieNames: movie_names,
    });
  })
  .catch((err) => {
    console.log(err);
  });
}); // Home page

app.get('/search', function(req, res) {
  activeUser(req);
  var search = req._parsedUrl.query

  if(search == 'all') {
    Product.find().then((result => {
      res.render('search_product', {
        Username: guestName,
        Search: search,
        Movie: result
      });
    }))
  } else {
    search = replaceAll(req._parsedUrl.query, {'%20': ' '});
    Product.find({name: RegExp(search, 'gi') })
    .then((result) => {
      res.render('search_product', {
        Username: guestName,
        Search: search,
        Movie: result
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
}); // Search for movies based on search bar input

function replaceAll(string, mapObj) {
  var regex = new RegExp(Object.keys(mapObj).join("|"),"gi");
  return string.replace(regex, function(matched) {
    return mapObj[matched.toLowerCase()];
  });
} // replaces values that are put in given map

app.get('/get_movie', function(req, res) {
  activeUser(req);
  var product_query = req._parsedUrl.query;
  Product.findById(product_query)
    .then((result) => {
      res.render('product_details', {
        Username: guestName,
        Amount: getProductAmount(result),
        Movie: result
      });
    }).catch((error) => {
      console.log(error)
      res.redirect('/')
    });
}); // Directs to the product details page

function getProductAmount(res) {
  const item = cartItems.find(c => c.id == res.id);
  if (item != null) {
    return item.amount;
  }
  return 0;
} // Returns the amount of the product based on cart

app.get('/login', function (req, res) {
  activeUser(req);
  res.render('login', {
    Username: guestName,
    Credentials: false
  });
}); // Login Page

app.post('/check', async function(req, res) {
  activeUser(req);
  let pass = true;
  await Customer.findOne({ username: req.body.username, password: req.body.password })
  .exec()
  .then((result) => {
    if (result != null) {
      currentUser = result.id;
      guestName = result.username;
      req.session.authenticated = true;
    } else {
      pass = false;
      res.render('login', {
        Username: guestName,
        Credentials: true
      });
    }
    return result;
  }).then((result) => {
    if (result == null) {
      return result;
    }
    return Cart.findOne({ user: currentUser }).exec();
  }).then(async (result) => {
    if (result != null) {
      inventoryChanges = result.notice;
      for (let i = 0; i < (result.item).length; i++) {
        await Product.findById(result.item[i].id)
        .exec()
        .then((prod) => {
          if (prod == null) {
            inventoryChanges.push({
              name: (result.item)[i].name,
              reason: "Unavailable"
            });
          } else {
            if (prod.price != (result.item)[i].price) {
              inventoryChanges.push({
                name: (result.item)[i].name,
                reason: "Price"
              });
              (result.item)[i].price = prod.price;
            }
            if (prod.stock != (result.item)[i].stock) {
              (result.item)[i].stock = prod.stock;
            }
            if (prod.stock < (result.item)[i].amount) {
              inventoryChanges.push({
                name: (result.item)[i].name,
                reason: "Stock"
              });
              (result.item)[i].amount = prod.stock;
            }
            cartItems.push((result.item)[i]);
            subTotal += (result.item)[i].amount * (result.item)[i].price;
          }
        });
      }
    }
    return cartItems;
  }).then(async (result) => {
    await Cart.findOneAndUpdate({ user: currentUser }, {
      item: cartItems,
      notice: inventoryChanges
    })
    .exec()
    .then((result) => {
      // Nothing needs to happen
      if (pass) {
        res.redirect('/')
      }
    });
  })
  .catch((error) => {
    console.log(error);
  })
}); // Login checking process and Cart check

app.get("/logout", function(req, res){
  if (currentUser != "") {
    currentUser = "";
    cartItems = [];
    guestName = 'Guest';
    subTotal = 0;
    req.session.destroy();
    res.redirect('/');
  }
}); // Log the user out

app.get('/create_account', function (req, res) {
  activeUser(req);
  res.render('create_account', {
    Username: guestName,
    taken: false,
    taken: false,
    tooShort: false,
    noSpec: false,
    noNum: false,
    userShort: false,
  });
}); //create account page

app.post('/create_account', function (req, res) {
  activeUser(req);
  var tooShort = false;
  var noSpec = false;
  var noNum = false;
  var userShort = false;
  var taken = false;

  user = req.body.username;
  password = req.body.password;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;

  if (!(/\d/.test(password))) {
    noNum = true;
  }
  if (password.length <= 6) {
    tooShort = true;
  }
  if ((!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(password))) {
    noSpec = true;
  }
  if (user.length < 6 ) {
    userShort = true;
  }

  Customer.findOne({ username: req.body.username })
    .then((result) => {
      if (result == null && !noSpec && !noNum && !tooShort && !userShort) {
        var newcust = new Customer();
        newcust.username = user;
        newcust.password = password;
        newcust.firstName = first_name;
        newcust.lastName = last_name;
        newcust.totalSpent = 0;

        newcust.save(function(error, savedUder){
          if (error) {
            console.log(error);
            return res.status(500).send();
          }
        });
        res.redirect('/login');
      } else if (userShort) {
        res.render('create_account', {
          Username: guestName,
          taken: taken,
          tooShort: tooShort,
          noSpec: noSpec,
          noNum: noNum,
          userShort: userShort
        });
      } else {
        if (null != result) {
          if (user == result.username) {
            taken = true;
          }  
        }
        res.render('create_account', {
          Username: guestName,
          taken: taken,
          tooShort: tooShort,
          noSpec: noSpec,
          noNum: noNum,
          userShort: userShort
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}); //create account page logic

app.get('/profile', function (req, res) {
  activeUser(req);
  const id = currentUser;
  if (id != '') {
    Customer.findById(id)
      .then((result) => {
        res.render('profile', {
          Username: guestName,
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
        Username: guestName,
        UserInfo: result,
        Unique: false
      });
    })
    .catch((err) => {
      console.log(err);
    })
  } else {
    res.redirect('/');
  }
}); // Update User's Profile Page

app.put('/profile/update/:id', async (req, res) => {
  activeUser(req);
  const id = currentUser;
  let info = {
    _id: currentUser,
    firstName: req.body.first,
    lastName: req.body.last,
    username: req.body.user,
    password: req.body.pass
  };
  if (id != "") {
    await Customer.findById(currentUser)
    .exec()
    .then(async (result) => {
      if (result != null) {
        if ((!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(req.body.pass)) || (req.body.pass).length < 6 || !(/\d/.test(req.body.pass))) {
          res.render("update_profile", {
            Username: guestName,
            UserInfo: info,
            Unique: true
          });
        } else if (guestName == result.username && result.username == req.body.user) {
          await Customer.findByIdAndUpdate(currentUser, {
            firstName: req.body.first,
            lastName: req.body.last,
            username: req.body.user,
            password: req.body.pass
          })
          .exec()
          .then((result) => {
            guestName = result.username;
            res.redirect('/profile');
          });
        } else if (result.name != req.body.user && (req.body.user).length > 6) {
          await Customer.findByIdAndUpdate(currentUser, {
            firstName: req.body.first,
            lastName: req.body.last,
            username: req.body.user,
            password: req.body.pass
          })
          .exec()
          .then((result) => {
            guestName = result.username;
            res.redirect('/profile');
          });
        } else {
          res.render("update_profile", {
            Username: guestName,
            UserInfo: info,
            Unique: true
          });
        }
      } else {
        res.render("update_profile", {
          Username: guestName,
          UserInfo: info,
          Unique: true
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  } else {
    res.redirect('/');
  }
}); // Updates database with new changes

app.post('/addCart', (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "") {
    updateCart(
      req.body.movieID,
      req.body.movieName,
      req.body.moviePoster,
      parseInt(req.body.moviePrice),
      parseInt(req.body.quantity),
      parseInt(req.body.movieStock)
    );
    res.send({ "check": true });
  } else {
    res.redirect('/addCart');
  }
}); // Adding item to cart

function updateCart(id, name, poster, price, quantity, stock) {
  const item = cartItems.find(c => c.id == id);
  if (item != null) {
    subTotal += item.price * quantity;
    item.amount += quantity;
    updateDBCart();
  } else {
    subTotal += price * quantity;
    newItem = {
      id: id,
      name: name,
      poster: poster,
      price: price,
      amount: quantity,
      stock: stock
    };
    cartItems.push(newItem);

    Cart.findOneAndUpdate({ user: currentUser }, {
      item: cartItems
    })
    .then((result) => {
      if (result == null) {
        const items = new Cart({
          user: currentUser,
          item: cartItems,
          notice: inventoryChanges
        })
        .save()
        .then((result) => {
          // Nothing needs to happen
        })
        .catch((error) => {
          console.log(error);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
} // Update the cart list and subtotal

app.delete('/cart/remove/:id', (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "") {
    const item = cartItems.find(c => c.id == req.body.id);
    const index = cartItems.indexOf(item);
    subTotal -= item.amount * item.price;
    cartItems.splice(index, 1);
    updateDBCart();
    res.send({ "check": true });
  } else {
    res.redirect('/');
  }
}); // Delete item from cart

app.put('/cart/add/:id', (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "") {
    const item = cartItems.find(c => c.id == req.body.id);
    if (item.amount < item.stock) {
      subTotal += item.price;
      item.amount++;
      updateDBCart();
      res.send({ "check": true });
    } else {
      res.send(false);
    }
  } else {
    res.redirect('/');
  }
}); // Add amount of an item from cart

app.put('/cart/sub/:id', (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "") {
    const item = cartItems.find(c => c.id == req.body.id);
    if (item.amount > 1) {
      subTotal -= item.price;
      item.amount--;
      updateDBCart();
      res.send({ "check": true });
    } else if (item.amount == 1) {
      const index = cartItems.indexOf(item);
      subTotal -= item.price;
      cartItems.splice(index, 1);
      updateDBCart();
      res.send({ "check": true });
    }else {
      res.send(false);
    }
  } else {
    res.redirect('/');
  }
}); // Subtract amount of an item from cart

function updateDBCart() {
  Cart.findOneAndUpdate({ user: currentUser }, {
    item: cartItems
  })
  .then((result) => {
    // Nothing needs to happen
  })
  .catch((error) => {
    console.log(error);
  });
} // Update the DB Cart collection

app.get('/cart', async (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "") {

    if (inventoryChanges.length == 0) {
      res.render("cart", {
        Username: guestName,
        Subtotal: (subTotal / 100).toFixed(2),
        Items: cartItems,
        Notice: false,
        Changes: []
      });
    } else {
      const tempInventoryChanges = [...inventoryChanges];
      inventoryChanges = [];
      await Cart.findOneAndUpdate({ user: currentUser }, {
        notice: inventoryChanges
      })
      .exec()
      .then((result) => {
        res.render("cart", {
          Username: guestName,
          Subtotal: (subTotal / 100).toFixed(2),
          Items: cartItems,
          Notice: true,
          Changes: tempInventoryChanges
        });
      });
    }

  } else {
    res.redirect('/');
  }
}); // Cart page

app.post('/cart/purchase', async (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "") {
    for (let i = 0; i < cartItems.length; i++) {
      await Product.findByIdAndUpdate(cartItems[i].id, {
        stock: cartItems[i].stock - cartItems[i].amount
      })
      .exec()
      .then((result) => {
        // Nothing needs to happen
      })
      .catch((error) => {
        console.log(error);
      });
    }
    await Customer.findById(id)
    .exec()
    .then(async (result) => {
      await Customer.findByIdAndUpdate(currentUser, {
        $inc: { totalSpent: subTotal }
      })
      .exec()
      .then(async (result) => {
        cartItems = [];
        inventoryChanges = [];
        subTotal = 0;
        await Cart.findOneAndUpdate({ user: currentUser }, {
          item: cartItems,
          notice: inventoryChanges
        })
        .exec()
        .then((result) => {
          transaction = true;
          res.redirect('/purchase/completed');
        })
        .catch((error) => {
          console.log(error);
        })
      })
      .catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    })
  } else {
    res.redirect('/');
  }
}); // Handles the purchase logic

app.get('/purchase/completed', (req, res) => {
  activeUser(req);
  const id = currentUser;
  if (id != "" || transaction) {
    transaction = false;
    res.render("complete", {
      Username: guestName
    });
  } else {
    res.redirect('/');
  }
});

app.get('/stock', (req, res) => {
  activeUser(req);
  Product.find().then((result) => {
    res.render('stock', {
      Username: guestName,
      Movie: result
    });
  })
  .catch((error) => {
    console.log(error)
  });
}); // Stock page

app.get('/stock/add', (req, res) => {
  activeUser(req);
  res.render('add_product', {
    Username: guestName
  });
}); // Stock add page

app.post('/stock/add', (req, res) => {
  activeUser(req);
  const new_product = new Product({
    name: req.body.title,
    categories: req.body.categories,
    price: req.body.price,
    release: req.body.release,
    stock: req.body.stock,
    poster: req.body.poster,
    description: req.body.description,
    summary: req.body.summary
  });
  new_product.save().then((result) => {
    res.send({ 'check': true });
  }).catch((error) => {
    console.log(error)
  });
}); // Stock add page logic

app.get('/stock/edit', (req, res) => {
  activeUser(req);
  var query = req._parsedUrl.query
  Product.find({ _id: query}).then((result) => {
    res.render('edit_product', {
      Username: guestName,
      Movie: result
    })
  })
  .catch((error) => {
    console.log(error)
  })
}); // Stock edit page

app.post('/stock/edit', (req, res) => {
  activeUser(req);
  Product.findByIdAndUpdate(req.body.id, {
    name: req.body.title,
    price: req.body.price,
    release: req.body.release,
    stock: req.body.stock,
    poster: req.body.poster,
    description: req.body.description,
    summary: req.body.summary
  }).then((result) => {
    res.send({ "check": true });
  });
}); // Stock edit page logic

app.get('/stock/delete', (req, res) => {
  activeUser(req);
  var query = req._parsedUrl.query;
  Product.find({ _id: query}).then((result) => {
    res.render('delete_product', {
      Username: guestName,
      Movie: result
    });
  })
  .catch((error) => {
    console.log(error)
  });
}); // Stock delete page

app.delete('/stock/delete', (req, res) => {
  activeUser(req);
  Product.findByIdAndDelete(req.body.movie_id).then((result) => {
    res.send({ 'check': true });
  })
  .catch((error) => {
    console.log(error);
  });
}); // Stock delete page logic
