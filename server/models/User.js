const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const recipeSchema = require('./Recipe').schema;
const itemSchema = require('./Item').schema;
const infoSchema = require('./Info').schema;
const dietSchema= require('./Diet').schema;
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  user: { type: String, required: true , unique:true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  previousdate: { type: Date, default: Date },
  items: [itemSchema],
  info:infoSchema,
  recipe:recipeSchema,
  diet:dietSchema
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    return next();
  }
  const hashedPassword =  bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});


userSchema.methods.matchPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
