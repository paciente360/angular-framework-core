(function () {
    'use strict';

    angular.module('letsAngular')
        .factory('Backgrid', BackgridFactory);

    BackgridFactory.$inject = ['$window'];

    function BackgridFactory($window) {
        return $window.Backgrid;
    }

})();
