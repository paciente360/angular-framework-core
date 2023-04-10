(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwUpload', fwUpload);

    fwUpload.$inject = ['$timeout', 'appSettings', '$sce'];

    function fwUpload($timeout, appSettings, $sce) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element) {

                $scope.f = {};

                var _input = element.find('input[type="hidden"]');

                var STORAGE_URL = appSettings.STORAGE_URL;
                if ($scope.field.customOptions.file.container != undefined) {
                    STORAGE_URL +=$scope.field.customOptions.file.container+"/";
                }

                $scope.isFileImage = function(filename){
                    return !!filename.match(/.(jpg|jpeg|png|gif)$/i)
                }

                $scope.isFileVideo = function(filename){
                    return !!filename.match(/.(mp4|avi|webm|wmv|m4v|mpg)$/i)
                }

                $scope.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };

                $scope.$on('setProgressFile', function () {
                    if ($scope.data[$scope.field.name]) {
                        $scope.f = {
                            name:$scope.data[$scope.field.name],
                            progress:100,
                            alreadySent:true,
                            isImage:$scope.isFileImage($scope.data[$scope.field.name]),
                            isVideo:$scope.isFileVideo($scope.data[$scope.field.name])
                        };
                        $scope.f.fileURL = STORAGE_URL+$scope.f.name;
                    }
                });

                $scope.removeFile = function(){
                    $scope.f = {};
                    _input.controller('ngModel').$setViewValue(null);
                }

                $scope.upload = function (file, errFiles) {

                    if(errFiles.length > 0 ){
                        console.log(errFiles);
                        
                        $scope.errFile = errFiles && errFiles[0];
                        errFiles.forEach(function(err){
                            if (err.$error=="pattern"){
                                $scope.field.error = "O formato do arquivo não é permitido.";
                                
                            }else if (err.$error=="minSize"){
                                $scope.field.error = "O tamanho do arquivo é menor que o permitido. ("+err.$errorParam+")"; 
                            
                            }else if (err.$error=="maxSize"){
                                $scope.field.error = "O tamanho do arquivo é maior que o permitido. ("+err.$errorParam+")"; 

                            }else if (err.$error=="minWidth"){
                                $scope.field.error = "A largura do arquivo é menor que o tamanho permitido. ("+err.$errorParam+"px)"; 

                            }else if (err.$error=="maxWidth"){
                                $scope.field.error = "A largura do arquivo é maior que o tamanho permitido. ("+err.$errorParam+"px)"; 
                            

                            }else if (err.$error=="minHeight"){
                                $scope.field.error = "A altura do arquivo é menor que o tamanho permitido. ("+err.$errorParam+"px)"; 

                            }else if (err.$error=="maxHeight"){
                                $scope.field.error = "A altura do arquivo é maior que o tamanho permitido. ("+err.$errorParam+"px)"; 
                            }

                        });
                    }

                    if (file) {
                        function nextBefore(newFile){
                            $scope.field.error = null;
                            $scope.f.name = file.name
                            $scope.f.uploading = true;
                            
                            $scope._upload($scope.field, newFile).then(function (response, err) {
                                $scope.$emit('upload-complete', response);
                                
                                $timeout(function () {
                                    $scope.f.progress = 100;
                                    $scope.f.alreadySent = true;
                                    $scope.f.uploading = false;
                                    $scope.f.name = response.data.result.files.file[0].name;
                                    $scope.f.fileURL = STORAGE_URL+$scope.f.name;
                                    $scope.f.isImage = $scope.isFileImage($scope.f.name)
                                    $scope.f.isVideo = $scope.isFileVideo($scope.f.name)

                                    _input.controller('ngModel').$setViewValue($scope.f.name);
                                });


                            }, function (response) {
                                console.log(response);
                                if (response.status > 0) {
                                    $scope.errorMsg = response.status + ': ' + response.data;
                                }
                                $scope.$emit('upload-error', response);

                                $timeout(function(){
                                    $scope.field.error = "Ocorreu um erro ao enviar o arquivo.";
                                    $scope.f = {};
                                })

                            }, function (evt) {
                                $timeout(function(){
                                    $scope.f.progress = Math.min(90, parseInt(100.0 *evt.loaded / evt.total));
                                })
                            })
                        }

                        if ("function" == typeof $scope.getscope){
                            var _scope = $scope.getscope()
                            _scope.$emit('before upload '+$scope.field.name, file, nextBefore);
                            if (!_scope.$$listeners["before upload "+$scope.field.name]){
                                nextBefore(file);
                            }
                        }else{
                            nextBefore(file);
                        }
                    }
                };

                $scope.dropFile = function($file, errFiles){
                    $scope.upload($file, errFiles)
                }

            }
        }
    }
})();
