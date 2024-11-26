const mongoose = require('mongoose');


const infoSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  gender: { type: String, required: true },
  bmiCategory:{type:String,required:true},
  bmi:{type:Number,required:true},
  allergies: { type: [String], required:true },
 
});

module.exports = mongoose.model('Info', infoSchema);