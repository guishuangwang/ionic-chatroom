// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
/*
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
*/

// MyChat App - Ionic & Firebase Demo
//var firebaseUrl = "https://sizzling-inferno-3944.firebaseio.com";
var firebaseUrl = "https://burning-inferno-3076.firebaseio.com";

function onDeviceReady() {
    angular.bootstrap(document, ["mychat"]);
}
//console.log("binding device ready");
// Registering onDeviceReady callback with deviceready event
document.addEventListener("deviceready", onDeviceReady, false);

// 'mychat.services' is found in services.js
// 'mychat.controllers' is found in controllers.js
angular.module('mychat', ['ionic', 'ngCordova', 'firebase', 'angularMoment', 'mychat.controllers', 'mychat.services'])

.run(function ($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        // To Resolve Bug
        ionic.Platform.fullScreen();

        $rootScope.firebaseUrl = firebaseUrl;
        $rootScope.displayName = null;

        Auth.$onAuth(function (authData) {
            if (authData) {
                console.log("Logged in as:", authData.uid);
            } else {
                console.log("Logged out");
                $ionicLoading.hide();
                $location.path('/login');
            }
        });

        $rootScope.logout = function () {
            console.log("Logging out from the app");
            $ionicLoading.show({
                template: 'Logging Out...'
            });
            Auth.$unauth();
        }


        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    console.log("setting config");
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // State to represent Login View
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl',
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
        }]
        }
    })



    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
      }]
        }
    })

    // Each tab has its own nav history stack:

    .state('tab.rooms', {
        url: '/rooms',
        views: {
            'tab-rooms': {
                templateUrl: 'templates/tab-rooms.html',
                controller: 'RoomsCtrl'
            }
        }
    })

    /*
    .state('tab.chat', {
        url: '/chat/:roomId',
        views: {
            'tab-rooms': {
                templateUrl: 'templates/tab-chat.html',
                controller: 'ChatCtrl'
            }
        }
    })
    */
    
    //create chat state, it is not belong to the tab again.
    .state('chat', {
        url: "/chat/:roomId",
        templateUrl: "templates/tab-chat.html",
        controller: 'ChatCtrl'
    })

    //State for the albumList
    .state('tab.albumList',{
        url: '/albumList',
        views: {
            'tab-albumList': {
                templateUrl: 'templates/tab-albumList.html',
                controller: 'albumListCtrl'
            }
        }
    })

    //State to view the uploaded images
    .state('images', {
        url: '/images/:albumId',
        templateUrl: 'templates/imagesViewer.html',
        controller: 'imagesViewerCtrl'
    })

    //State to view the image details
    .state('imageDetails', {
        url: '/imageDetails',
        templateUrl: 'templates/imageDetails.html',
        controller: 'imageDetailsCtrl'
    })

    //State for settings
    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'templates/tab-settings.html',
                controller: 'settingsCtrl'
            }
        }
    })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});