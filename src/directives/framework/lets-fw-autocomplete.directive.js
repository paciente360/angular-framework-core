(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwAutoComplete', fwAutoComplete);

    fwAutoComplete.$inject = ['$compile'];

    function fwAutoComplete($compile) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            priority: 1,
            link: function (scope, element) {
                var _input = element.find('input');

                var clickHandler = function () {
                    var _oldVal = _input.val();
                    var _val = _oldVal + ' ';
                    _input.controller('ngModel').$setViewValue(_val);
                    scope.$digest;
                    _input.controller('ngModel').$setViewValue(_oldVal);
                };

                element.find('button').click(clickHandler);
                _input.click(clickHandler);
            },
            controller: function () {
                
            },
            controllerAs: controllerName
        };
    }
})();
