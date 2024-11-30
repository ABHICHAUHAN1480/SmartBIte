const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  expire: { type: Date, required: true },
  unit:{type:String,required:true},
  id: { type: String, required: true },
  dayLeft: { type: Number},
 
});

module.exports = mongoose.model('Item', itemSchema);