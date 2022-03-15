// Dependencies
const express = require("express") //require express as a dependency
const mongoose = require('mongoose') //require mongoose dependency
const Product = require("./models/schema") //require the model from the js file (model)
const seedData = require('./models/products');
const app = express() //initialize express server
const methodOverride = require('method-override') //needed for delete route
require("dotenv").config() //we require this so that we can "hide" the login info and secure 
//permissions in a separate env file (initialize this and .gitignore alongside express) but
//still make things available to nodejs

// Listener
const PORT = process.env.PORT || 3000
//have the saved port in a separate env file with a saved number
//otherwise, run on the port assigned by the cloud server

//connect and config mongodb
const DATABASE_URL = 'mongodb+srv://admin:abc1234@cluster0.n4yev.mongodb.net/mongostore?retryWrites=true&w=majority';

mongoose.connect(DATABASE_URL);

//set up listeners for mongodb
//shortcut variable for mongodb
//also will log connection or error messages using fat arrow function
const db = mongoose.connection;
db.on('connected', () => console.log('connected to mongodb'));
db.on('error', (err) => console.log('mongodb: ' + err.message));

//mount middleware
app.use(express.urlencoded({ extended: false})); //this creates req.body

//mount routes
app.use(express.static("public"));

app.use(methodOverride('_method'))
//using Postman just allows us to simmulate or run the process of iINDUCES through
//mongodb based on our schema and what the user does

// seed route
app.get('/products/seed', (req, res ) => {
    Product.deleteMany({}, (error, alreadyExistingData) => {
        console.log('deleted all products from mongoDB')
    })
    Product.create(seedData, (error, allProducts) => {
        console.log('seeded products into mongoDB')
        res.redirect('/products')
    })
})

//index route
app.get('/products', (req, res) => {
    Product.find({}, (error, allProducts) => {
        res.render('index.ejs', { allProducts }); //will bring us back all of the products in our schema, so we pluralize
    })
            //passing just the model 'Product' just indidcates it's an object
});

//new route
app.get('/products/new', (req, res) => {
    res.render('new.ejs');
})
 
/*when you start referencing the id, understand that it will be unique to each document
additionally, the methods "find by..." will give instructions to the server of which id
to look for and what to do with it "and delete" etc. */

//delete route
app.delete('/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
        res.redirect('/products') //same concept as above
    });
});

//update route
app.put('/products/:id', (req, res)  => {
    Product.findByIdAndUpdate(req.params.id,
        req.body,
        { new: true },
        (err, updatedProduct) => {
            res.redirect(`/products/${req.params.id}`);
        }
    );
});
//create or post route
app.post('/products', (req, res) => {
    //pushing data into an array
    Product.create(req.body, (error, newProduct) => {
        //the following is a callback function to happen AFTER creation
        res.redirect('/products');
    }); //creates a model instance from the user data
    //and runs asynchronyously 
});

//edit route
app.get('/products/:id/edit', (req, res) => {
    Product.findById(req.params.id, (error, singleProduct) => {
        res.render('edit.ejs', {singleProduct})
    });
});

//show route
app.get('/products/:id', (req, res) => { //:id is used because it is stable to identify an instance
    //will ask (req) by the parameter id
    Product.findById(req.params.id, (error, singleProduct) => {
        res.render('show.ejs', { singleProduct}) //will return the found item to the client because the ids are unique
    //assigned the name 'singleProduct' because we want to see one single item
    //based on the unique id we get assigned to each object/document
    })
}); 

app.put('/store/:id/buy', (req, res) => { //buy button will be like an update
    Product.findById(req.params.id, (err, product) => {
        if(product.qty){
            product.qty--
            product.save(() => {
                res.redirect(`/products/$${product._id}`)
            })
        } else {
            res.redirect(`/products/${product._id}`)
        }
    })
})

app.listen(PORT, () => {
    console.log(`server is listning on port: ${PORT}`)
});