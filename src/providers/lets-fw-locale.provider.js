(function () {
    'use strict';

    var module = angular.module('letsAngular')

    module.provider('locale', localeProvider);
    function localeProvider () {

        this.locale = "pt-br";
        this.catalog = {};
        this.onSetLocale;

        this.addCatalog = function(name, obj){
            if (this.catalog[name]){
                console.error(name+" property already exists in the catalog.")
                return false;
            }
            this.catalog[name] = obj;
        }

        this.translate = function(varname){
            var pos = eval('this.catalog.'+varname);
            if (pos && pos[this.locale]){
                return pos[this.locale];
            }else{
                return "{{__"+varname+"__}}"
            }           
        }

        this.setLocale = function(locale){
            this.changeLocale(locale);

            if (this.locale=="pt-br"){
                window.ParsleyValidator.setLocale('pt-br');
                moment.locale('pt-br');
    
            }else if (this.locale=="en"){
                window.ParsleyValidator.setLocale('en');
                moment.locale('en');
    
            }else if (this.locale=="es"){
                window.ParsleyValidator.setLocale('es');
                moment.locale('es');
    
            }

            if ("function"==typeof(this.onSetLocale)){
                this.onSetLocale(locale);
            }
        }

        this.getLocale = function(){
            return this.locale;
        }

        this.changeLocale = function(locale){
            this.locale = locale;
        }

        this.$get = function () {
            return this;
        };

    }

    module.filter('locale', locale);
    locale.inject = ["locale"];
	function locale(locale) {
        return function (varname) {
            return locale.translate(varname);
        }
    }

    module.filter('date_format', dateFormat);
	function dateFormat() {
        return function (date, param1) {
            return moment(date).format(param1)
        }
    }


})();
  