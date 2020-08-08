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
    
        self.createCRUDModal = function (headers, data, ctrl, template, parentScope) {
            return self._createModal({
                animation: true,
                templateUrl: template || 'lets/views/crud/crud-modal.html',
                controller: ctrl || 'CRUDFormModalController',
                resolve: {
                    headers: function() { 
                        var _headers = angular.copy(headers);
                        _headers.parentScope = parentScope;

                        if( typeof(_headers.get)!=="function" ){
                            _headers.get = function(name){
                                for (var _x in _headers.fields) {
                                    var field = _headers.fields[_x];
                
                                    if (field.name == name) {
                                        return field;
                                    }
                                }
                            }
                        }

                        return _headers;
                    },
                    data: function() {
                        try {
                            var _data = angular.copy(data);
                        } catch(error) {
                            var _data = jQuery.extend({}, data);
                        }
                        return _data;
                    },
                    parentScope:parentScope
                },
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                windowClass: headers.modal_id ? 'modal-'+headers.modal_id : ''
            });
        };
    
        self.hide = function () {
            $rootScope.$emit('cancel-modal');
        };
    
        return {
            createModal: self._createModal,
            createCRUDModal: self.createCRUDModal,
            hide: self.hide
        };
    }
  
})();
  