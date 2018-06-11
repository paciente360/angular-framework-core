/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - String Service
*
* File:        services/utils/lets-utils-string.service.js
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
        .service('utilsStringService', utilsStringService);
  
    utilsStringService.inject = [];
  
    function utilsStringService() {
  
        var self = this;
    
        self._placeholderList = ['paciente'];
        self._placeholderAttr = ['nome'];
    
        self.removeAccents = function(str) {
            var accents    = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
            var accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
            str = str.split('');
            var strLen = str.length;
            var i, x;
            for (i = 0; i < strLen; i++) {
            if ((x = accents.indexOf(str[i])) != -1) {
                str[i] = accentsOut[x];
            }
            }
            return str.join('');
        };
        self._removeSpecialChars = function(str) {
            var specialChars = '!@#$%*()-_+=/.,:;?[{]}`~^|';
            str = str.split('');
            var strLen = str.length;
            var i;
            for (i = 0; i < strLen; i++) {
            if (specialChars.indexOf(str[i]) != -1) {
                str[i] = '';
            }
            }
            return str.join('');
        };
        self.lemmatize = function (str) {
            str = self.removeAccents(str);
            return self._removeSpecialChars(str);
        };
        self.changePlaceholders = function (texto, data) {
            self._placeholderList.forEach(function (placeholder, i) {
                if (data[placeholder]) {
                    var _place = '[' + placeholder.toUpperCase() + ']';
                    if (texto.indexOf(_place) !== -1) {
                        var _split = texto.split(_place);
                        var _texto = '';
                        var _count = _split.length;
                        _split.forEach(function (_substr, j) {
                            _texto = _texto + _substr;
                            if (j < _count-1) _texto = _texto + data[placeholder][self._placeholderAttr[i]];
                        });
                        texto = _texto;
                    }
                }
            });
            return texto;
        };
    
        return {
            removeAccents: self.removeAccents,
            lemmatize: self.lemmatize,
            changePlaceholders: self.changePlaceholders
        };
  
    }
  
  })();
  