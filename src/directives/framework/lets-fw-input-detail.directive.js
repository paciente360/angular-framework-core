(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwInputDetail', fwInputDetail);

    fwInputDetail.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery'];

    function fwInputDetail(viaCEP, $timeout, $compile, jQuery) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'lets/views/framework/input-detail.html',
            replace: true,
            link: {
                post: function preLink(scope, $el, attrs, controller) {

                }
            }
        }
    }
})();
