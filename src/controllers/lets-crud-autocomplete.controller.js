(function () {
	'use strict';

	var module = angular.module('letsAngular');

	module.controller('AutoCompleteController', function ($scope, locale, $q, $timeout) {

		$scope.autocompleteModels = {};
		$scope.doafterAutoCompleteSelect = {};

		$scope._autocomplete = function (field, val, detail) {

			var data = $scope.filterdata || $scope.data || {};

			var queries = [];
			var deferred = $q.defer();

			// Autocomplete Dependencies
			if (field.autocomplete_dependencies.length > 0) {
				var deps = field.autocomplete_dependencies;
				for (var x in deps) {
					var dep = deps[x];
					if (data[dep.field] == undefined || data[dep.field] == null || data[dep.field] == "null") {

						var text =
							locale.translate('letsfw.select_before')
								.replace('%name%', (dep.label ? dep.label.toLocaleLowerCase() : dep.field))
								.replace('%gender%', (dep.gender ? dep.gender : 'o(a)'));

						var data = [];
						data.push({ id: null, label: text });

						deferred.resolve(data);

						return deferred.promise;
					} else {
						queries[dep.field] = typeof(data[dep.field])=="object" ?  data[dep.field].id : data[dep.field];
					}
				}
			}

			// Check Value
			if (val.length>0){
				val = encodeURIComponent(val.trim())
			}


			if (val.length == 0 || field.customOptions.select == true) {
				val = '[blank]';
			}

			// Callback Continue
			var callback = function (options) {

				var isAdd = !Array.isArray(field.quickAdd) && typeof(field.quickAdd)=="object";

				var exs = options.length>0;
				if (options.length==0 && !isAdd){
					options.unshift({ id: null, label: locale.translate('letsfw.no_record_found') });
				}

				if (field.customOptions.select == true && exs) {
					if (field.customOptions.searchBlank) {
						options.unshift({ id: "null", label: locale.translate('letsfw.is_blank') });
					}
					if (!field.customOptions.required) {
						options.unshift({ id: null, label: '--- ' + locale.translate('letsfw.select') + ' ---' });
					}
				}

				if (isAdd && val != '[blank]' && !exs) {
					var _lbl = "<p><i class='fa fa-plus'></i> "+(field.quickAdd.label || "Cadastrar")+"</p>"+decodeURIComponent(val);
					options.push({ id:null, label: _lbl, quickAdd:true, value:decodeURIComponent(val)});
				}

				deferred.resolve(options);
			}

			// Check field type
			if (field.customOptions.list == undefined) {

				if (field.customOptions.general !== undefined) {
					var route = 'general/autocomplete/' + field.customOptions.general + '/' + val;
				
				} else if (detail){
					var route = 'details/' + detail + '/autocomplete/' + field.name + '/' + val;
				
				} else {
					var route = 'autocomplete/' + field.name + '/' + val;
				}

				if (field.customOptions.select == true) {
					queries["limit"] = 0;
				} else {
					queries["limit"] = 20;
				}

				$scope.resource.customGET(route, queries).then(function (options) {
					callback(options);
				}, function errorCallback() {
					return deferred.reject();
				});

			} else {
				var options = angular.copy(field.customOptions.list) || [];
				callback(options);
			}

			return deferred.promise;
		}

		$scope._autocompleteSelect = function ($item, $model, $label, detail) {
			this.field.error = undefined;

			var _data = this.detail_data || this.data || {};

			if ($item.id != null && typeof $item.id != 'integer' || (typeof $item.id == 'integer' && $item.id > 0)) {
				_data[this.field.name] = $item.id;
			}
			else if ($item.id == null) {
				_data[this.field.name] = _data[this.field.name + '.label'] = null;
			}
			else {
				_data[this.field.name + '.label'] = null;
				return false;
			}

			if (detail) {
                this.detail_data = _data;
            } else {
                this.data = _data;
            }

			if ($item.quickAdd){
				return $scope.$emit('autocomplete-quickAdd-' + this.field.name, {scope:$scope, value:$item.value });
			}

			$scope.$emit('autocomplete-select-' + this.field.name, {scope:$scope, value:$item });

			if (typeof $scope.doafterAutoCompleteSelect[this.field.name] == "function") {
                $scope.doafterAutoCompleteSelect[this.field.name].call(this, _data, $item, $model, $label);
            }

			var field = this.field;
			$timeout(function () {
				jQuery('#' + field.name).trigger('keyup');
			});
		}

        $scope.autocompleteAdd = function (query) {
            // console.log(query);
        }

		$scope.autocomplete = function (field, val) {
            return this._autocomplete(field, val, null);
        }

        $scope.autocompleteDetail = function (detail, field, val) {
            return this._autocomplete(field, val, detail);
		}
		
		$scope.autocompleteSelect = function(detail, $item, $model, $label) {
            this._autocompleteSelect($item, $model, $label, null);
        };

        $scope.autocompleteDetailSelect = function (detail, $item, $model, $label) {
            this._autocompleteSelect($item, $model, $label, detail);
        }

	});

})();