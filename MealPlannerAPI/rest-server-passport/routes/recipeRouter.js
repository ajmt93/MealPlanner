var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Recipe = require('../models/recipe');

var Verify = require('./verify');

var recipeRouter = express.Router();
recipeRouter.use(bodyParser.json());

recipeRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Recipe.find({ "postedBy": { $eq : req.decoded._id } })
    .populate('postedBy')
    .exec(function (err, recipe) {
        if (err) return next(err);
        res.json(recipe);
    })
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
  req.body.postedBy = req.decoded._id;
  Recipe.create(req.body, function (err, recipe) {
      if (err) return next(err);
      console.log('Recipe created!');
      var id = recipe._id;
      res.writeHead(200, {
          'Content-Type': 'text/plain'
      });

      res.end('Added the recipe with id: ' + id);
  });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Recipe.remove({ "postedBy": { $eq : req.decoded._id } }, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

//********************************************************************//

recipeRouter.route('/:recipeId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Recipe.find( {"_id": { $eq: req.params.recipeId }, "postedBy": { $eq : req.decoded._id } } )
        .populate('postedBy')
        .exec(function (err, recipe) {
        if (err) return next(err);
        res.json(recipe);
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Recipe.findOneAndUpdate({"_id": { $eq: req.params.recipeId }, "postedBy": { $eq : req.decoded._id } }, {
        $set: req.body
    }, {
        new: true
    }, function (err, recipe) {
        if (err) return next(err);
        res.json(recipe);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Recipe.remove({"_id": { $eq: req.params.recipeId }, "postedBy": { $eq : req.decoded._id } }, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = recipeRouter;
