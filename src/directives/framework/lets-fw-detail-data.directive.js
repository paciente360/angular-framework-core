(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwDetailData', fwDetailData);

    fwDetailData.$inject = ['$rootScope', '$timeout', '$compile', 'jQuery', '$sce'];

    function fwDetailData($rootScope, $timeout, $compile, jQuery, $sce) {
        return {
            restrict: 'E',
            scope: true,
            template: '<span" ng-bind-html="formatData(detail_data, field)"></span>',
            replace: true,
            link: {
                pre: function preLink(scope, $el, attrs, controller) {

                    scope.formatData = function (data, field) {

                        if (field.autocomplete !== false) {
                            return data[field.name + '.label'].label || data[field.name + '.label'];
                        }

                        if (field.type == 'date') {
                            if (field.customOptions.hour) {
                                return moment(data[field.name]).format('DD/MM/YYYY HH:mm');
                            } else {
                                return moment(data[field.name]).format('DD/MM/YYYY');
                            }
                        }


                        if (field.type == 'boolean') {
                            if (field.customOptions.statusFalseText && field.customOptions.statusTrueText) {
                                if (data[field.name]) {
                                    return field.customOptions.statusTrueText;
                                } else {
                                    return field.customOptions.statusFalseText;
                                }
                            }
                        }


                        if (field.type == 'string' && field.customOptions.file) {
                            var url = $rootScope.appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/download/' + data[field.name];
                            return $sce.trustAsHtml('<a target="_blank" href="' + url + '" class="btn btn-default ng-scope" style=""><i class="glyphicon glyphicon-download"></i></a>');
                        }


                        return data[field.name];

                    }

                }
            }
        }
    }
})();
