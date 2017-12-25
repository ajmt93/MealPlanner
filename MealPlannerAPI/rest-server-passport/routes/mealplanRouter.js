var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Mealplan = require('../models/mealplan');

var Verify = require('./verify');

var mealplanRouter = express.Router();
mealplanRouter.use(bodyParser.json());

mealplanRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Mealplan.find({ "postedBy": { $eq : req.decoded._id } })
    .populate('postedBy')
    .populate('recipes.recipe')
    .exec(function (err, mealplan) {
        if (err) return next(err);
        res.json(mealplan);
    })
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
  req.body.postedBy = req.decoded._id;
  Mealplan.create(req.body, function (err, mealplan) {
      if (err) return next(err);
      console.log('Mealplan created!');
      var id = mealplan._id;
      res.writeHead(200, {
          'Content-Type': 'text/plain'
      });

      res.end('Added the mealplan with id: ' + id);
  });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Mealplan.remove({ "postedBy": { $eq : req.decoded._id } }, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

//********************************************************************//

mealplanRouter.route('/:mealplanId')
.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Mealplan.findOneAndUpdate({"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } }, {
        $set: req.body
    }, {
        new: true
    }, function (err, mealplan) {
        if (err) return next(err);
        res.json(mealplan);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Mealplan.remove({"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } }, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});


//*********************************************************************//

mealplanRouter.route('/:mealplanId/recipe')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Mealplan.findOne( {"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } })
        .populate('recipes.recipe')
        .exec(function (err, mealplan) {
        if (err) return next(err);
        res.json(mealplan.recipes);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Mealplan.findOneAndUpdate(
      {"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } },
      { $addToSet: {recipes: req.body} },
      {upsert:true, new: true},
      function (err, mealplan) {
        if (err) return next(err);
        console.log('Recipe added to meal plan!');
        res.json(mealplan);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Mealplan.findOne({"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } }, function (err, mealplan) {
        if (err) return next(err);
        for (var i = (mealplan.recipes.length - 1); i >= 0; i--) {
            mealplan.recipes.id(mealplan.recipes[i]._id).remove();
        }
        mealplan.save(function (err, result) {
            if (err) return next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all recipes!');
        });
    });
});

//*********************************************************************//

mealplanRouter.route('/:mealplanId/recipe/:recipeId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Mealplan.findOne( {"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } } )
        .populate('recipes.recipe')
        .exec(function (err, mealplan) {
        if (err) return next(err);
        res.json(mealplan.recipes.id(req.params.recipeId));
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Mealplan.findOne({"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } },
     function (err, mealplan) {
        if (err) return next(err);
        mealplan.recipes.id(req.params.recipeId).remove();
        req.body.postedBy = req.decoded._id;
        mealplan.recipes.push(req.body);
        mealplan.save(function (err, mealplan) {
          res.json(mealplan);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  Mealplan.findOne({"_id": { $eq: req.params.mealplanId }, "postedBy": { $eq : req.decoded._id } },
   function (err, mealplan) {
      if (err) return next(err);
      mealplan.recipes.id(req.params.recipeId).remove();
      mealplan.save(function (err, mealplan) {
        res.json(mealplan);
      });
  });
});

module.exports = mealplanRouter;
