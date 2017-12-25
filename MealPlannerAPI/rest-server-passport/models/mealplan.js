var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    //a day and location are used to locate where in the meal plan the
    //meal will be located (a multidimensional array).
    day: {
        type: Number,
        required: true
    },
    location: {
        type: Number,
        required: true
    }
});

var mealplanSchema = new Schema ({
  name: {
    type: String,
    required: true,
    default: 'default'
  },
  recipes: [recipeSchema],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps : true
});



var MealPlan = mongoose.model('MealPlan', mealplanSchema);

module.exports = MealPlan;
