(function () {
    'use strict';
    angular
        .module('letsAngular')
        .service('fwErrorService', fwErrorService);

    fwErrorService.inject = ['ngToast'];

    function fwErrorService (ngToast) {

        var self = this;

        self.emitFormErrors = function (crudForm) {
            var messages = [];
            var errorTypes = Object.keys(crudForm.$error);
            var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

            for (var t in errorTypes) {
                var type = crudForm.$error[errorTypes[t]];

                for (var _x in type) {
                    var label = type[_x].$options.fieldInfo.label;
                    if (errorTypes[t] == 'required') {
                        messages.push('O campo ' + label + ' é obrigatório');
                    } else if (errorTypes[t] == 'date' && pattern.test(type[_x].$viewValue) == false) {
                        messages.push('O campo ' + label + ' está com uma data inválida');
                    }
                }
            }

            if (messages.length > 0) ngToast.warning(messages.join("<br />"));
        };

        return {
            emitFormErrors: self.emitFormErrors
        };
    }

})();
