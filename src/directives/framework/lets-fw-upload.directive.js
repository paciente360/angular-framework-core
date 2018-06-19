(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwUpload', fwUpload);

    fwUpload.$inject = ['$timeout'];

    function fwUpload($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element) {

                $scope.defaultProgress = 0;
                $scope.alreadySent = false;

                window.setProgressFile = function(){
                    if ($scope.data[$scope.field.name] != undefined && $scope.data[$scope.field.name] != null) {
                        $scope.defaultProgress = 100;
                        $scope.alreadySent = true;
                    }
                };

                $scope.upload = function (file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];

                    if (file) {
                        file.upload = $scope._upload($scope.field, file);

                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                                var _input = element.find('input[type="hidden"]');

                                file.newName = response.data.result.files.file[0].name;

                                _input.controller('ngModel').$setViewValue(file.newName);

                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };
                
            }
        }
    }
})();
