# CST438_Project_2 - *Movies R Movies Store*

[**Movies R Movies Store**](https://cst438-project2-groupd.herokuapp.com) is a full-stack web store that sells movies.

## Project Section Details

### All pages

All pages have the following:
- [x] Search Bar
- [x] Navigation to pages of the site

### Home Page

Users will see the Home page with the following features:
- [x] List of featured movies

Things to note:
- You will not have access to the welcome drop down unless you are signed in!
- Clicking on the movie's name will take you to its product page

Image of the page:

<img src='/doc_images/home.png' alt='Home' />

### Create Account Page

Users will see the Create Account page with the following features:
- [x] Textboxes to fill in the information

Things to note:
- Firsname and Lastname do not matter but have to be filled in
- Username must be at least 7 characters long
- Password must be at least 7 characters long, 1 special character, and 1 numerical character

Image of the page:

<img src='/doc_images/register.png' alt='Register' />

### Login Page

Users will see the Login page with the following features:
- [x] Textboxes to fill in the information

It is the standard login process. Not much to say.

Image of the page:

<img src='/doc_images/login.png' alt='Login' />

### Search Page

Users will see the Search page with the following features:
- [x] List of movies based on the input of the search bar

Things to Note:
- Typing `all` will trigger all the movies to show up
- Clicking on the movie's name will take you to its product page

Image of the page:

<img src='/doc_images/search.png' alt='Search' />

### Product Details Page

Users will see the Product Details page with the following features:
- [x] Add or Subtract buttons to determine how many you will add to the cart
- [x] Add to cart button, self-explanatory

Things to note:
- None of the buttons will show up if there is no user logged in!
- Cannot go under 1 for the value
- Cannot go over the limit of current stock in store
- If no more stock, buttons will be replaced without of stock message
- If you add the maximum to your cart, when you access the page again it will state to go to your cart and make the changes there

Image of the page not logged in:

<img src='/doc_images/details.png' alt='Details' />

Image of the page logged in:

<img src='/doc_images/details_purchase.png' alt='Details_Log' />

### Profile Page

Users will see the Profile page with the following features:
- [x] List of all their information
- [x] Button to update your information

Self-explanatory.

Image of the page:

<img src='/doc_images/profile.png' alt='Profile' />

### Update Profile Page

Users will see the Update Profile page with the following features:
- [x] List of information (except totalSpent) in text boxes to edit
- [x] Button to update your information

Things to Note:
- Username and Password follow the same logic as the create account page

Image of the page:

<img src='/doc_images/update_profile.png' alt='Profile_Update' />

### Cart Page

Users will see the Cart page with the following features:
- [x] List of movies added to the cart
- [x] Buttons to add, subtract, or delete the item of the cart
- [x] Button to complete the purchase
- [x] Have the subtotal displayed to the user of how much they will pay

Things to Note:
- If a product is no longer in inventory, it will be removed from the user's cart
- If a product's price changes, it will be reflected in the cart to be up-to-date
- If a product's stock changes to lower from the cart, it will be adjusted to match the new stock number
- Any match/combination of the top 3, a message will be showed with the cart changes at the top of the cart list only once when the user enters the cart
- The purchase button will only show up if there is an item in the cart

Image of the page:

<img src='/doc_images/cart.png' alt='Cart' />

### Purchase Page

Users will see the Purchase page after clicking the purchase button in the cart.

Things to Note:
- Users can go to their profile page and see the amount of money they have spent on the site.

Image of the page:

<img src='/doc_images/purchase_complete.png' alt='Purchase_Complete' />

### Admin Stock Tab

Admin will see the Stock Tab only.

Image of the tab:

<img src='/doc_images/tab.png' alt='Tab' />

### Stock Page (Admin)

Admin will see the Stock page with the following features:
- [x] List of movies in inventory
- [x] Button to add a new movie
- [x] Button to edit a movie's details
- [x] Button to delete a movie from inventory

Things to Note:
- All changes will be reflected immediately on the Stock page

Image of the page:

<img src='/doc_images/stock.png' alt='Stock' />

### Add Movie Page (Admin)

Admin will see the Stock page with the following features:
- [x] List of requirements that are needed to fill out
- [x] Button to add a new movie to inventory

Self-explanatory.

Image of the page:

<img src='/doc_images/add_movie.png' alt='Add_Movie' />

### Update Movie Page (Admin)

Admin will see the Stock page with the following features:
- [x] List of requirements that are needed to fill out
- [x] Button to update new movie that is in the inventory

Self-explanatory.

Image of the page:

<img src='/doc_images/update_movie.png' alt='Update_movie' />

### Delete Movie Page (Admin)

Admin will see the Stock page with the following features:
- [x] Button to add delete movie from inventory

Self-explanatory.

Image of the page:

<img src='/doc_images/delete_movie.png' alt='Delete_Movie' />

## Video Walkthrough

Here's a walkthrough of implemented features (CSUMB ONLY ACCESS):

[Video Walkthrough of Project 2](https://drive.google.com/file/d/13-3bYISDLKYQ0NtA0a4e8VXhVff3SOZt/view)

## Tools Used in our Project

Database: Free tier MongoDB <br />
Deployment: Heroku <br />
Codebase: Github <br />
Environment: Node.js <br />

Here is a list of npm packages used in our project:
- [x] express
- [x] ejs
- [x] nodemon
- [x] mongodb
- [x] mongoose
- [x] mongoose-currency
- [x] mocha
- [x] method-override
- [x] express-session
- [x] bluebird
