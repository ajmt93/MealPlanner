var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//****************************//
var recipeSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true
    },
    ingredients: {
      type: String,
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }, {
    timestamps: true
});
//****************************//
var Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
