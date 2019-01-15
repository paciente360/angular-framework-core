(function () {
    'use strict';
    angular
        .module('letsAngular')
        .provider('fwState', fwStateProvider);

    function fwStateProvider ($stateProvider) {

        this.$get = $stateProvider.$get;
        this.state = $stateProvider.state;

        this.setCRUDRoutes = function (settings) {

            var _options = {
                main: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud.html',
                    controller: 'CRUDController',
                },
                list: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud-list.html',
                    controller: 'CRUDController'
                },
                edit: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud-edit.html',
                    controller: 'CRUDEditController'
                },
                new: {
                    enable: true,
                    templateUrl: 'lets/views/crud/crud-edit.html',
                    controller: 'CRUDEditController'
                }
            };

            var options = angular.merge(_options, settings.options);

            if (options.main.enable) {
                this.state('app.'+settings.route, {
                    abstract: true,
                    url: '/'+settings.route,
                    templateUrl: options.main.templateUrl,
                    controller: options.main.controller,
                    resolve: {
                    id: ['$stateParams', function ($stateParams) {
                        return $stateParams.id;
                    }],
                    module: function () {
                        return settings.modelName;
                    }
                    }
                });
            }
            
            if (options.list.enable) {
                this.state('app.'+settings.route+'.list', {
                    url: '?filter',
                    templateUrl: options.list.templateUrl,
                    controller: options.list.controller
                });
            }
            if (options.new.enable) {
                this.state('app.'+settings.route+'.new', {
                    url: '/new?filter',
                    templateUrl: options.new.templateUrl,
                    controller: options.new.controller
                });
            }
            if (options.edit.enable) {
                this.state('app.'+settings.route+'.edit', {
                    url: '/:id/edit?filter',
                    templateUrl: options.edit.templateUrl,
                    controller: options.edit.controller
                });
            }
        }
    }
})();
  