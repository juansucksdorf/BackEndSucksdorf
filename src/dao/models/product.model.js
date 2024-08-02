const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');



const productSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String },

  price: { type: Number, default: 0 },

  thumbnail: { type: String, default: '' },

  code: { type: String, unique: true },

  stock: { type: Number },

  status: {type: Boolean, default:true},

  category: {type: String},


});
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
