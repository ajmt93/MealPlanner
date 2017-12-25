'use strict';

angular.module('mealPlannerApp')

.controller('mealplanController', ['$scope','mealplanFactory', 'ngDialog',
function ($scope, mealplanFactory, ngDialog) {
    $scope.mealplans = mealplanFactory.query();
    if($scope.mealplans.length === 0 && $scope.mealplans.constructor === Object){
      mealplanFactory.save();
      $state.go($state.current, {}, {reload: true});
    }
    $scope.week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    //day and location are numbers to follow the rest API schema.
    $scope.day = 0;
    $scope.location = 0;


    $scope.editDay = function (day) {
      $scope.day = day;

      var modal = ngDialog.open({ template: 'views/editDayCard.html', scope: $scope, className: 'ngdialog-theme-default', controller: function ($scope) {
          //change the mealplan for the day.
          $scope.currentMealplan = $scope.mealplans[0];
          console.log($scope.currentMealplan);
          $scope.doAction = function () {
            mealplanFactory.update()

          };

          $scope.toggle = function (item) {
            item.selected = !item.selected;
          }

          $scope.close = function() {
            ngDialog.close();
          };
        }
      });
      modal.closePromise.then(function() {
      })
    };
}])

.controller('RecipeController', ['$scope', 'recipeFactory', 'ngDialog', '$state',
function ($scope, recipeFactory, ngDialog, $state) {
    $scope.recipes = recipeFactory.query();

    $scope.openRecipe = function (recipe) {
         ngDialog.open({ template: 'views/recipeCard.html', scope: $scope, className: 'ngdialog-theme-default', data: recipe});
    };

    $scope.newRecipe = function () {
      $scope.recipe = { name:"", ingredients: "", instructions: ""};
      var modal = ngDialog.open({ template: 'views/newRecipeCard.html', scope: $scope, className: 'ngdialog-theme-default', controller: function ($scope) {
        //Add new recipe
        $scope.doAction = function () {
            console.log('Adding recipe', $scope.recipe);
            recipeFactory.save($scope.recipe)
            ngDialog.close();
          };
        }
      });
      modal.closePromise.then(function() {
        console.log($scope.recipe);
        $scope.recipes.push($scope.recipe);
      })
    };

    $scope.editRecipe = function (recipe) {
      $scope.recipe = recipe;

      var modal = ngDialog.open({ template: 'views/newRecipeCard.html', scope: $scope, className: 'ngdialog-theme-default', controller: function ($scope) {
        //edit existing recipe
        $scope.doAction = function () {
            console.log('Editing recipe', $scope.recipe);
            recipeFactory.update({ id: $scope.recipe._id }, $scope.recipe)
            ngDialog.close();
          };
      }
    });
  };

    $scope.deleteRecipe = function (recipeId) {
      recipeFactory.delete({id: recipeId});
      $state.go($state.current, {}, {reload: true});
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html',
                        height: 400,
                        scope: $scope,
                        className: 'ngdialog-theme-default',
                       controller:"LoginController" });
    };

    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $scope.stateis = function(curstate) {
       return $state.is(curstate);
    };

}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);

        ngDialog.close();

    };
}])
;
