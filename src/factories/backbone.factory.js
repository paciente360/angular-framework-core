(function () {
    'use strict';

    angular.module('letsAngular')
        .factory('Backbone', BackboneFactory);

    BackboneFactory.$inject = ['$window'];

    function BackboneFactory($window) {
        return $window.Backbone;
    }

})();
