const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
    favourite: { type: [Number] ,default: []},
  });


  module.exports = mongoose.model('Recipe', recipeSchema);