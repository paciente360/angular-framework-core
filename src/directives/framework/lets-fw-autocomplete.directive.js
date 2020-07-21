(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwAutoComplete', fwAutoComplete);

    fwAutoComplete.$inject = ['$compile', '$timeout'];

    function fwAutoComplete($compile, $timeout) {
        var controllerName = 'vm';
        return {
            restrict: 'A',
            priority: 1,
            link: function (scope, element) {
                var _input = element.find('input');

                var clickHandler = function () {
                    if (!_input.val()){
                        _input.controller('ngModel').$setViewValue(undefined);
                        $timeout(function(){
                            _input.controller('ngModel').$setViewValue("");
                        });
                    }
                };

                element.find('button').click(clickHandler);
                _input.click(clickHandler);

                _input.keyup(function(){
                    if (this.value.trim()==""){
                        _input.scope().data[_input.attr('name')] = null;
                    }
                })

                element.find('.icon.fa-close').click(function(){
                    _input.scope().data[_input.attr('name')] = null;
                    _input.scope().data[_input.attr('name') + '.label'] = null;
                    _input.scope().autocompleteSelect({});
                    _input.val('');
                    _input.controller('ngModel').$setViewValue('')
                });

            },
            controller: function () {
                
            },
            controllerAs: controllerName
        };
    }
})();
