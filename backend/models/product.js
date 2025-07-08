
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  photo:{type: String},
  category:{type: String},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product