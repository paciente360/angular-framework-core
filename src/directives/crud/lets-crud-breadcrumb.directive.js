(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudBreadcrumb', crudBreadcrumb);

    crudBreadcrumb.$inject = [];

    function crudBreadcrumb() {
        return {
            restrict: 'E',
            templateUrl: 'lets/views/framework/breadcrumb.html',
            replace: true,
            link: function (scope, $el) {

            }
        }
    }
})();