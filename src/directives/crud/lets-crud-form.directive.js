(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudForm', crudForm);

    crudForm.$inject = ['jQuery', '$timeout', 'appSettings'];

    function crudForm(jQuery, $timeout, appSettings) {
        return {
            replace: false,
            link: function (scope, $el) {

                /* Dropzone */
                //Set options for dropzone
                for (var y in scope.headers.fields) {
                    var field = scope.headers.fields[y];
                    if (field.customOptions.file) {
                        scope.dzOptions = {
                            url: appSettings.API_URL + 'upload/' + field.customOptions.file.container + '/upload',
                            acceptedFiles: field.customOptions.file.acceptedFiles,
                            maxFilesize: '25',
                            maxFiles: '1',
                            uploadMultiple: false,
                            addRemoveLinks: true,
                        };
                    }
                }
                //Apply methods for dropzone
                scope.dzMethods = {};
                scope.removeNewFile = function () {
                    scope.dzMethods.removeFile(scope.newFile); //We got $scope.newFile from 'addedfile' event callback
                }
                /* Dropzone */


                jQuery($el).on('click', '.button-new', function () {
                    var detail = jQuery(this).attr('detail');
                    var origin = jQuery(this).attr('origin');
                    var modal = jQuery(this).attr('form-modal')=="true";

                    scope.newDetailData(origin, detail, modal);
                });

                $timeout(function () {
                    $el.find('.tab-group .nav-tabs li:first').find('a').click();
                    $el.find(':input[type!="hidden"]:first').focus();
                }, 500);

                $($el).parsley({
                    priorityEnabled: false,
                    errorsContainer: function (el) {
                        return el.$element.closest(".input-container");
                    }
                });

            }
        }
    }
})();
