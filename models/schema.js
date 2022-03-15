// 1) require mongoose dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// 2) define a mongoose schema with a relevant variable
//new with mongoose.schema will create it/host is on mongo
const productSchema = new Schema({
    name: { type: String, required: true},  //makes name a required property/key
    description: { type: String},
    img: { type: String},
    price: { type: Number },
    qty: { Number}
});
//in between the closing curly brace and parenthesis you can add an option schema
//to enable additional features in mongo. will go between {}

// 3) compile mongoose schema into a mongoose model
module.exports = mongoose.model('Product', productSchema);

/*
Product.create()
Product.find()
Product.findById()
Product.findOne()
Product.findByIdAndUpdate()
Product.findByIdAndDelete()

*/ 

