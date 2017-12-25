'use strict';

angular.module('mealPlannerApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'mealplanController'
                    }
                }

            })

            // route for the myRecipes page
            .state('app.myRecipes', {
                url:'recipe',
                views: {
                    'content@': {
                        templateUrl : 'views/myRecipes.html',
                        controller  : 'RecipeController'
                    }
                }
            })

            // route for the shopping list page
            .state('app.shoppingList', {
                url:'shopping_list',
                views: {
                    'content@': {
                        templateUrl : 'views/shoppingList.html',
                        controller  : 'ShoppingListController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
;
