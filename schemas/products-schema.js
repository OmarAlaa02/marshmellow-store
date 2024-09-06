const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String, 
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
    default: 'images/error.jpg', 
  },
});

module.exports = mongoose.model('products', schema);
