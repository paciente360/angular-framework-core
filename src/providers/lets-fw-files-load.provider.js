/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - File Load Provider
*
* File:        providers/framework/lets-fw-file-load.provider.js
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
  