(function () {
    'use strict';
    angular
        .module('letsAngular')
        .provider('fwFileLoad', fwFileLoadProvider);

    function fwFileLoadProvider () {

        this.$get = ['$templateRequest', function($templateRequest) {
            return new FwFileLoadService($templateRequest);
        }];

    }

    function FwFileLoadService ($templateRequest) {
  
        var self = this;

        self.getCrudBaseTemplate = function () {
            return $templateRequest('lets/views/crud/crud.html');
        };

        self.getCrudListTemplate = function () {
            return $templateRequest('lets/views/crud/crud-list.html');
        };
        
        self.getCrudEditTemplate = function () {
            return $templateRequest('lets/views/crud/crud-edit.html');
        };
    
        return {
            getCrudBaseTemplate: self.getCrudBaseTemplate,
            getCrudListTemplate: self.getCrudListTemplate,
            getCrudEditTemplate: self.getCrudEditTemplate
        };
  
    }
})();
  