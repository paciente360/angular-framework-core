(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDController', function ($scope, Restangular, module, $state, $window, $stateParams, $rootScope, headers, swangular) {
        $scope.headersReady = false;
        $scope.export_btn_is_disable = false;

        function getHeaders() {
            var data = angular.copy(headers.get(module));
            $scope.headers = data;
        }

        getHeaders();

        $scope.$on('refresh-headers', function () {
            getHeaders();
        })

        $scope.resource = Restangular.all($scope.headers.route);

        $scope.$broadcast('headers-set');
        $scope.headersReady = true;

        $scope.getFilter = function(){
            return decodeURIComponent($window.location.search).replace("?filter=","");
        }

        $scope.goNew = function () {
            $state.go($state.current.name.replace('.list', '.new'), {filter:$scope.getFilter()});
        };

        $scope.goToList = function () {
            if ($state.current.name.indexOf('.list') == -1) {
                $state.go($state.current.name.replace('.edit', '.list').replace('.new', '.list'), {filter:$scope.getFilter()});
            }
        };

        $scope.edit = function (row) {
            $state.go($state.current.name.replace(/\.list$/, '.edit'), { id: row.id, page: null, filter:$scope.getFilter()});
        };

        $scope.delete = function (row) {
            return $scope.resource.customDELETE(row.id).then(function () {
                $rootScope.$broadcast('refreshGRID');
            });
        };

        $scope.export = function(){

            var bigFiltro = $scope.getFilter();
            $scope.export_btn_is_disable = true;
            var resource = $scope.resource;
            function filtraExport (item){
              return item.export;
            }
      
            function mapExportName(item){
              var obj = {};
              obj[item.name] = item.label;
              if(!!item.customOptions && !!item.customOptions.exportColumn){
                obj["exportColumn"] = item.customOptions.exportColumn;
              }
              return obj;
            }
      
            function caminhaObj(obj, vetor){
              if(vetor.length <= 0){
                return null;
              }else if(vetor.length == 1){
                if(obj[0]){
                  var res = obj.map(function(objt){
                    return objt[vetor[0]];
                  });
                  return res;
                }else{
                  return obj[vetor[0]];
                }
              }else{
                if(obj[0]){
                  var novoObj = [];
                  var novoVetor = vetor.slice(1);
                  obj.forEach(function(objt){
                    novoObj.append(objt[vetor[0]]);
                  })
                  return caminhaObj(novoObj, novoVetor);
                } else{
                  var novoObj = obj[vetor[0]];
                  var novoVetor = vetor.slice(1);
                }
                var novoVetor = vetor.slice(1);
                return caminhaObj(novoObj, novoVetor);
              }
            }
      
            function montaColunasComNomes(fields, trocas, caminho) {
              if(fields[0]){
                fields.forEach(function(campo){
                  caminho += Object.keys(campo)[0] + '#';
                  if(campo.exportColumn){
                    var antestxt = caminho + campo.exportColumn[0].name
                    trocas.push({
                      antes: antestxt.split('#'),
                      depois: campo.exportColumn[0].label
                    })
                  }else{
                    var nextfield = Object.keys(campo);
                    if(Array.isArray(campo[nextfield[0]])){
                      var filhos = campo[nextfield[0]];
                      filhos.forEach(function(filho){
                        montaColunasComNomes([filho], trocas, caminho);
                      })
                    }
                  }
                  caminho = '';
                });
              }
            }
      
            // debugger;
            function extraiColunas(headers){
              var headers_field = headers.fields
              .filter(filtraExport)
                .map(mapExportName);
              if(headers.tabs){
                for(var k in headers.tabs){
                  var tab = extraiColunas(headers.tabs[k])
                  if(tab) {
                    var obj = {};
                    obj[k] = tab;
                    obj.real_name = headers.tabs[k].label;
                    if(!!headers.tabs[k].customOptions && !!headers.tabs[k].customOptions.exportColumn){
                      obj["exportColumn"] = headers.tabs[k].customOptions.exportColumn;
                    }
                    headers_field.push(angular.copy(obj));
                  };
                  // if(tab) headers_field.push({[k]: tab});
                }
              }
              if(headers.tabs_session){
                for(var k in headers.tabs_session){
                  var tabsession = extraiColunas(headers.tabs_session[k]);
                  if(tabsession) {
                    var obj = {};
                    obj[k] = tabsession;
                    obj.real_name = headers.tabs_session[k].label;
                    if(!!headers.tabs_session[k].customOptions && !!headers.tabs_session[k].customOptions.exportColumn){
                      obj["exportColumn"] = headers.tabs_session[k].customOptions.exportColumn;
                    }
                    headers_field.push(angular.copy(obj));
                  }
                  // if(tabsession) headers_field.push({[k]: tabsession});
                }
              }
              return (headers_field.length)? headers_field : undefined;
            }
      
            function percorreObjeto(objeto, caminho){
              return caminho.reduce(function(obj, key){
                // debugger;
                if(obj && obj[0]){
                  var saida = [];
                  obj.forEach(function(it){
                      if(it){
                          saida.push(it[key]);
                      }
                  });
                  return saida;
                }else{
                  return (obj && obj[key] !== 'undefined' ? obj[key] : undefined)
                }
              }, objeto);
            };
      
            function filtrarGrid(filtro) {
              var _f = {};
              // //debugger;
        
              filtro = filtro.split('&');
              for (var i = 0; i < filtro.length; i++) {
                var q = filtro[i].split('=', 2);
                if (q[0] == 'q') {
                  // Query geral
                  _f[q[0]] = q[1];
                } else if (q[0] == 'p') {
                  // Pagination
                  _f['page'] = q[1];
                } else if ((/_ini$/g).test(q[0])) {
                  //  Range Inicio
                  _f['filter[' + q[0].replace(/_ini$/g, '') + '][ini]'] = decodeURIComponent(q[1]);
                } else if ((/_fim$/g).test(q[0])) {
                  // Range Fim
                  _f['filter[' + q[0].replace(/_fim$/g, '') + '][fim]'] = decodeURIComponent(q[1]);
                } else {
                  // Query especificas
                  _f['filter[' + q[0] + ']'] = decodeURIComponent(q[1]);
                }
              }
        
              return _f
            }
            
            var fields = extraiColunas($scope.headers);
            // console.log(fields);
            
            var htmlmodal = '<div class="d-flex flex-column" style="margin-top: 30px;align-items: flex-start;">';
            var htmlIds = [];
            var columnXlsx = [];
      
            function escreveAninhado(fields, array, a_var){
              var pai = Object.keys(fields)[0];
              var filhos = Object.values(fields);
              var html = '';
              // debugger;
              filhos.forEach(function(filho, i){
                if(Object.keys(fields)[i] !== "exportColumn"){
                  if(typeof(filho) === "string"){
                    if(fields.real_name !== filho){
                      var idx= array.join('').replace(' ', '_');
                      html += '<div>';
                      html += '<input type="checkbox" id="m_'+ idx + pai +'" name="m_'+ array.join('') + pai +'" checked>';
                      html += '<label for="m_'+ idx + pai +'">&nbsp;'+ array.join(' -> ')+ ' -> ' +filho+'</label>';
                      html += '</div>';
                      htmlIds.push('m_'+ idx + pai);
                      columnXlsx.push(a_var.join('#')+'#'+pai);
                    }
                  }else{
                    if(!(pai + 1 > 0)){
                      array.push(fields.real_name);
                      a_var.push(pai);
                    }
                    html += escreveAninhado(filho, array, a_var);
                  }
                }
              });
      
              return html;
            }
      
            for(var key in fields){
              var k = Object.keys(fields[key])[0];
              var ob = Object.values(fields[key])[0];
              if(typeof(ob) ===  "string"){
                htmlmodal += '<div>';
                htmlmodal += '<input type="checkbox" id="m_'+ k +'" name="m_'+ k +'" checked>';
                htmlmodal += '<label for="m_'+ k +'">&nbsp;'+ob+'</label>';
                htmlmodal += '</div>';
                htmlIds.push('m_'+k);
                columnXlsx.push(k);
              }else{ 
                // debugger;
                htmlmodal += escreveAninhado(fields[key], [], []);
              }
            }
      
            htmlmodal += '</div>';
      
            // console.log(htmlIds);
            // console.log(columnXlsx);
       
            swangular.swal({
              title: 'Selecione as Colunas Desejadas',
              html: htmlmodal,
              preConfirm: function(){
                var elementos = htmlIds.map(function(item){
                  return document.getElementById(''+item).checked
                });
                return elementos
              },
              showCancelButton: true,
            }).then(function(result){
              
              if(!!result.value){
                
                swangular.swal({
                  html: 'Buscando dados...',
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  onOpen:function(){
                      swangular.showLoading();
                  }
                });

                var clmnxlsx = columnXlsx.filter(function(column, index){
                  return result.value[index]
                });
       
                
                var all_filter = filtrarGrid(bigFiltro);
                
                var totalRecords = $scope.totalPager || $('tr').find('td').last().data('model').collection.state.totalRecords;
                all_filter = Object.assign({}, all_filter,{per_page: totalRecords});
                

                resource.customGET('pager', all_filter).then(function (response) {
                  
                  
                  
                  function nextBeforeExport() {
                    
                    var res = response.data.map(function(lead){   
                      var leadFiltrado = {}
                      clmnxlsx.forEach(function(column){
                        var atrbts =  column.split('#');
                        if(atrbts.length == 1){
                          leadFiltrado[column] = lead[column];
                        }else if(atrbts.length>1){
                          var aux = atrbts.reduce(function(obj, atb, i){
                            if(i === atrbts.length - 1){
                              obj? obj[atb] = caminhaObj(lead, atrbts): '';
                              return obj;
                            }
                            return (obj? (obj[atb] = obj[atb]? obj[atb]: {}): '');
                          }, leadFiltrado);
                        }
                      });
                      return leadFiltrado;
                    });

                    var trocas = [];
                    montaColunasComNomes(fields, trocas, '');
                    // console.log(trocas);
                    
                    res.map(function(row){
                      var trc = trocas;
                      trc.forEach(function(troca){
                        // row[troca.depois] = percorreObjeto(row, troca.antes);
                        
                        var aux = percorreObjeto(row, troca.antes);
                        if(typeof(aux) === 'object')aux = aux.join(', ');
        
                        row[troca.depois] = aux;
        
                      });
                      // SÓ PODE DELETAR DEPOIS DE ATRIBIR TODOS POIS PODE ACONTECER DE UM ATRIBUTO TER ALGUM ATRIBUTO PAI EM COMUM
                      // debugger;
                      trc.forEach(function(troca){
                        if(troca.antes[0] != troca.depois){
                          delete row[troca.antes[0]];
                        }
                      });
                      // FAZ DATA 
                      // for(var key in row){
                        // debugger;
        
                        // if(!row[key].match(/[A-Z]{2,}[0-9]{4,}(_[A-Z0-9]{1,6})?/g) && moment(row[key], 'YYYY-MM-DD', true).isValid()){
                        //   var aux = moment(row[key], 'YYYY-MM-DD');
                        //   row[key] = aux.format('DD/MM/YY h:mm');
                        // }
        
                        // if(moment(row[key], 'YYYY-MM-DD').isValid()){
                        //   var aux = moment(row[key], 'YYYY-MM-DD');
                        //   row[key] = aux.format('DD/MM/YY h:mm');
                        // }
                      // }
        
                    });

                    // var oldLabels = fOldLabels(fields);
                    // var titles = fTitles(res)
                    // var oldIndex = fOldIndex(oldLabels, titles);
        
                    // debugger;
                    
                    // fields
                    /* generate a worksheet */
                    swangular.close();
                    var ws = XLSX.utils.json_to_sheet(res);
                    // oldIndex.forEach(function(oi, i){
                    //   if(oi != -1){
                    //     var celula = 'A'+ (oi+1);
                    //     var cell = ws[celula];
                    //     delete ws[celula].w;
        
                    //     ws[celula].v = labelcelula(fields, oldLabels[i]);
                    //   }
                    // });
                    /* add to workbook */
                    var wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "dadosexportados");
                    /* write workbook and force a download */
                    var date = moment().unix();
                    XLSX.writeFile(wb, "Exportacao_" + date + ".xlsx");
        
                    $scope.export_btn_is_disable = false;
                  }

                  $scope.$emit("before export", response, nextBeforeExport);
                  if (!$scope.$$listeners["before export"]){
                    nextBeforeExport();
                  }
                });
                
              }else{
                $scope.export_btn_is_disable = false;
              }
            });
          }
    });

})();