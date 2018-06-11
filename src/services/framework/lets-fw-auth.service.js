(function () {
    'use strict';
    angular
        .module('letsAngular')
        .service('fwAuthService', fwAuthService);
  
    fwAuthService.inject = ['$window', 'LoopBackAuth', 'Usuario', '$state', '$auth', 'appSettings', '$http'];
  
    function fwAuthService($window, LoopBackAuth, Usuario, $state, $auth, appSettings, $http, $q) {
        var SERVER_URL = appSettings.API_URL;
        var self = this;
    
        self.updateLocalStorage = function (item, i) {
            var user = self.getUser();
            user[item] = i;
            self.setUserInfo(user);
        }
    
        self.setUserLb = function (accessToken) {
            // console.log(LoopBackAuth);
            LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
            LoopBackAuth.rememberMe = true;
            LoopBackAuth.save();
        }
    
        self.setUserInfo = function (user) {
            window.localStorage['user'] = angular.toJson(user);
        }
    
        self.getUser = function () {
            if (window.localStorage['user']) {
                return JSON.parse(window.localStorage['user']);
            }
            return false;
        }
    
        self.isAuthenticated = function () {
            return LoopBackAuth.currentUserId != null;
        }
    
        //Autenticacao Provider
        self.authenticate = function (provider) {
            // self.count++;
            return $auth.authenticate(provider)
                .then(function (response) {
                    var obj = { accessToken: response.access_token }
                    return $http.post(SERVER_URL + 'users/facebook/token', obj);
                })
                .then(function (response) {
                    // console.log(response);
                    var accessToken = {
                        id: response.data.id,
                        userId: response.data.user.id,
                        user: response.data.user
                    }
                    self.setUserLb(accessToken);
                    self.setUserInfo(response.data.user);
                    self.removeSatellizer();
                    //$auth.setToken(response.data.id);
                    // window.localStorage['user'] = angular.toJson(response.data.user);
                    // window.localStorage['$LoopBack$accessTokenId'] = window.localStorage.getItem('satellizer_token');
                    // window.localStorage['$LoopBack$currentUserId'] = JSON.parse(window.localStorage.getItem('user')).id;
                    // window.localStorage['$LoopBack$rememberMe'] = true;
                    $state.go('main.search');
                })
                .catch(function (err) {
                    console.debug(err);
                })
            // .finally(function () {
            //      self.count--;
            // })
        }
    
        self.logout = function (token) {
            Usuario.userLogout({ 'accessToken': token })
                .$promise
                .then(function (success) {
                    LoopBackAuth.clearUser();
                    LoopBackAuth.clearStorage();
                    $window.localStorage.removeItem('user');
                    $state.go('login');
                })
                .catch(function (err) {
                    // console.log('err');
                    // console.log(err);
                    LoopBackAuth.clearUser();
                    LoopBackAuth.clearStorage();
                    $window.localStorage.removeItem('user');
                    $state.go('login');
                });
        }
    
        self.getCurrentUserId = function () {
            return LoopBackAuth.currentUserId;
        }
    
        self.getCurrentUserToken = function () {
            return LoopBackAuth.accessTokenId;
        }
    
        self.removeSatellizer = function () {
            if ($window.localStorage.getItem('satellizer_token')) {
                $window.localStorage.removeItem('satellizer_token');
            }
        }
    }
})();
  