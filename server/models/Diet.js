const mongoose = require('mongoose');


const dietSchema = new mongoose.Schema({
 paramsday:{type:String,required:false},
 paramsweek:{type:String,required:false}
});

module.exports = mongoose.model('Diet', dietSchema);