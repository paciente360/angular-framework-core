(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudBreadcrumb', crudBreadcrumb);

    crudBreadcrumb.$inject = ['$state'];

    function crudBreadcrumb($state) {
        return {
            restrict: 'E',
            templateUrl: 'lets/views/framework/breadcrumb.html',
            replace: true,
            link: function (scope, $el) {
                scope.idData = $state.params.id;
            }
        }
    }
})();