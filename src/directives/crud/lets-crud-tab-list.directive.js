(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudTabList', crudTabList);

    crudTabList.$inject = ['jQuery'];

    function crudTabList(jQuery) {
        return {
            scope: {
                crudTabListData: '=',
                crudTabListSettings: '&',
                parentData: '='
            },
            templateUrl: 'lets/views/crud/crud-tab-list.html',
            link: function (scope, $el) {
    
                setTimeout(function () {
                    var settings = scope.crudTabListSettings();
    
                    scope.data = scope.parentData;
                    scope.type = settings.type;
                    scope.headers = settings.headers;
                    scope.app = scope.$parent.app;
                    if (scope.crudTabListData) {
                        scope.extraData = scope.crudTabListData;
                    }
                }, 1000);
            }
        }
    }
})();


