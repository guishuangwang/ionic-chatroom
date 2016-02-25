/*
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
*/

angular.module('mychat.controllers', ["ngCordova", "firebase", "ionic"])

.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    //console.log('Login Controller Initialized');

    var ref = new Firebase($scope.firebaseUrl);
    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.createUser = function (user) {
        console.log("Create User Function called");
        if (user && user.email && user.password && user.displayname) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (userData) {
                alert("User created successfully!");
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    displayName: user.displayname
                });
                $ionicLoading.hide();
                $scope.modal.hide();
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
            alert("Please fill all details");
    }

    $scope.signIn = function (user) {

        if (user && user.email && user.pwdForLogin) {
            $ionicLoading.show({
                template: 'Signing In...'
            });
            auth.$authWithPassword({
                email: user.email,
                password: user.pwdForLogin
            }).then(function (authData) {
                console.log("Logged in as:" + authData.uid);
                ref.child("users").child(authData.uid).once('value', function (snapshot) {
                    var val = snapshot.val();
                    // To Update AngularJS $scope either use $apply or $timeout
                    $scope.$apply(function () {
                        $rootScope.displayName = val;
                    });
                });
                $ionicLoading.hide();
                $state.go('tab.rooms');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        } else
            alert("Please enter email and password both");
    }
})

.controller('ChatCtrl', function ($scope, Chats, $ionicScrollDelegate, $timeout, $state) {
    //console.log("Chat Controller initialized");
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    //test for img
    $scope.toUser = {
      _id: '534b8e5aaa5e7afc1b23e69b',
      pic: 'http://ionicframework.com/img/docs/venkman.jpg',
      username: 'Venkman'        
    }
    $scope.IM = {
        textMessage: ""
    };

    // Fetching Chat Records only if a Room is Selected

    $scope.roomName = " - " + Chats.getSelectedRoomName();
    $scope.chats = Chats.all();

    $timeout(function() {
      viewScroll.scrollBottom();
    }, 0);

    $scope.sendMessage = function (msg) {
        console.log(msg);

        Chats.send($scope.displayName, msg);
        $scope.IM.textMessage = "";

        $timeout(function() {
            viewScroll.scrollBottom(true);
        }, 1000);

    }

    $scope.remove = function (chat) {
        Chats.remove(chat);
    }
})

.controller('RoomsCtrl', function ($scope, Rooms, Chats, $state) {
    //console.log("Rooms Controller initialized");
    $scope.rooms = Rooms.all();

    $scope.openChatRoom = function (roomId) {
        Chats.selectRoom(roomId);

        Chats.getSelectedRoomName();

        $state.go('chat', {
            roomId: roomId
        });
    }
    
})

//Controller for the album list 
.controller("albumListCtrl", function($scope, Images, $state) {
    
    $scope.albumList = [
    { id: 1, name: '旅行', admin: '管理员1', image: 'img/travel.jpg' },
    { id: 2, name: '摄影', admin: '管理员2', image: 'img/camera.jpg' },
    { id: 3, name: '音乐', admin: '管理员3', image: 'img/music.jpg' },
    { id: 4, name: '游戏', admin: '管理员4', image: 'img/game.jpg' }
    ];

    $scope.imagesViewer = function(albumId) {

        Images.selectAlbum(albumId);

        $state.go('images',{
            albumId: albumId
        });

    };
  
})


//Controller for the images viewer
.controller("imagesViewerCtrl", function($scope, Images, $cordovaCamera, $ionicPopup, $state) {

    //$ionicHistory.clearHistory();, $firebaseArray, $cordovaCamera
    $scope.title = Images.getAlbumName();

    $scope.images = Images.all();

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.images.$add({image: imageData}).then(function() {
                navigator.notification.alert(
                    '图片已经上传',
                    null,
                    '上传图片',
                    '确认'
                    );
            });
        }, function(error) {
            console.error(error);
        });
    }

    $scope.imageDetails = function() {
        $state.go('imageDetails');
    }

})

//Controller for the image details
.controller("imageDetailsCtrl", function($scope, Images, $ionicPopup) {


})

.controller('settingsCtrl', function($scope, $ionicPopup) {
    /*
    when using ionicPopup, it seems has some display bugs, however the functionality is fine.
    //Alert dialog
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: "TOC Workshop",
            template: "版本 1.0.0"
        });
        alertPopup.then(function(res) {
            console.log('Thanks for your support');
        });
    };

    //confirm dialog
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: "mychat",
            template: "确定退出么？"
        });
        confirmPopup.then(function(res) {
            if(res) {
                alert("ture");
            }
            else {
                alert("false");
            }
        });
    };
    */
    $scope.showAlert = function() {
        navigator.notification.alert(
            '版本 1.0.0 - weichao',
            null,
            'TOC 出品',
            '确认'
            );
    };

    var onConfirm = function(buttonIndex) {
        if(buttonIndex === 1){
            $scope.logout();
        }
    };

    $scope.showConfirm = function () {
        navigator.notification.confirm(
            '确定您要退出聊天室么？',
            onConfirm,
            '退出',
            ['是','否']
            );
    };
});
