/*global angular*/
/*jslint plusplus: true*/
/*!
* Angular Lets Core - Print Service
*
* File:        services/utils/lets-utils-print.service.js
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
        .service('utilsPrintService', utilsPrintService);

    utilsPrintService.inject = ['$templateRequest', '$rootScope', '$compile', '$timeout'];

    function utilsPrintService($templateRequest, $rootScope, $compile, $timeout) {

        var self = this;

        self._printHTML = function (html) {
            var hiddenFrame = $('<iframe></iframe>').appendTo('body')[0];
            hiddenFrame.contentWindow.printAndRemove = function() {
                hiddenFrame.contentWindow.print();
                setTimeout(function(){ $(hiddenFrame).remove(); }, 3000);
            };

            var htmlDocument = "<!doctype html>"+
                "<html>"+
                '<body onload="printAndRemove();">' + // Print only after document is loaded
                html +
                '</body>'+
                "</html>";
            var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");

            doc.write(htmlDocument);
            doc.close();
        };
        self.print = function (templateURL, data) {
            moment.locale('pt-br');
            var printScope = angular.extend($rootScope.$new(), data);
            $templateRequest(templateURL).then(function (template) {
                var element = $compile($('<div>' + template + '</div>'))(printScope);
                var waitForRenderAndPrint = function() {
                    if(printScope.$$phase) {
                        $timeout(waitForRenderAndPrint);
                    } else {
                        self._printHTML(element.html());
                        printScope.$destroy(); // To avoid memory leaks from scope create by $rootScope.$new()
                    }
                };
                waitForRenderAndPrint();
            });
        };

        return {
            print: self.print
        }

    }

})();
