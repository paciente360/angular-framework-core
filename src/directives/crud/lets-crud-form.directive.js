(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('crudForm', crudForm);

    crudForm.$inject = ['jQuery', '$timeout', 'fwModalService'];

    function crudForm(jQuery, $timeout, fwModalService) {
        return {
            replace: false,
            link: function (scope, $el) {

                jQuery($el).on('click', '.button-new', function () {
                    var detail = jQuery(this).attr('detail');
                    var origin = jQuery(this).attr('origin');
                    
                    if (scope.data[detail] == undefined) {
                        scope.data[detail] = [];
                    }

                    var headers = scope.headers[origin][detail];
                    var parentModel = scope.headers.route.toLowerCase();
                    var autocompleteDetail = true;

                    if (headers.autocompleteDetail !== undefined) autocompleteDetail = headers.autocompleteDetail;

                    fwModalService.createCRUDModal(headers, parentModel, null, autocompleteDetail)
                        .then(function (response) {
                            response.new = true;
                            response.disabled = true;
                            scope.data[detail].push(response);
                        });

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
