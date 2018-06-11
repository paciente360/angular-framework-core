/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Modal Service
*
* File:        services/framework/lets-fw-modal.service.js
* Version:     1.0.0
*
* Author:      Lets Comunica
* Info:        https://bitbucket.org/letscomunicadev/angular-framework-crud/src
* Contact:     fabio@letscomunica.com.br
*
* Copyright 2018 Lets Comunica, all rights reserved.
* Copyright 2018 Released under the MIT License
*
* This source file is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
*/

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
            templateUrl: template || 'src/views/crud/crud-modal.html',
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
  