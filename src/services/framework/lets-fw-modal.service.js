(function () {
    'use strict';
    angular
        .module('letsAngular')
        .service('fwModalService', fwModalService);
  
    fwModalService.inject = ['$modal', 'jQuery', '$rootScope'];
  
    function fwModalService($modal, jQuery, $rootScope) {
  
        var self = this;
    
        self._createModal = function (config) {
            return $modal.open(config).result;
        };
    
        self.createCRUDModal = function (headers, parentModel, data, autocompleteDetail, ctrl, template) {
            return self._createModal({
            animation: true,
            templateUrl: template || 'lets/views/crud/crud-modal.html',
            controller: ctrl || 'CRUDFormModalController',
            resolve: {
                headers: function() { return headers; },
                parentModel: function() { return parentModel; },
                autocompleteDetail: function() { return autocompleteDetail; },
                data: function() {
                var _data;
                try {
                    _data = angular.copy(data);
                } catch(error) {
                    _data = jQuery.extend({}, data);
                }
                return _data;
                }
            },
            size: 'lg',
            backdrop: 'static',
            keyboard: false
            });
        };
    
        self.hide = function () {
            $rootScope.$emit('cancel-modal');
        };
    
        return {
            createCRUDModal: self.createCRUDModal,
            hide: self.hide
        };
    }
  
})();
  