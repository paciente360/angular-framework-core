Angular Framework Core 
=============

- [Instalação](#instalação)
- [Headers](#headers)
- [Modules](#modules)

# Instalação

```bash
  bower install --save https://github.com/paciente360/angular-framework-core.git#1.0.2
```

# Headers

Possiveis parâmetros de configuração que podem ser fornecidos para headers.js

```js
(function () {
  'use strict';

  // Angular.js
  var module = angular.module('singApp.carros');

  // Angular.js
  module.config(cfg);

  function cfg(headersProvider) {
    var _headers = {
      "label": "Carros",	// Nome exibido na tela de consulta
      "label_row": "Carro", // Nome exibido no formulário de cadastro
      "route": "carros", // Rota a ser chamada no backend
      "auto_layout": true, // Faz a distribuição dos inputs no formulário de cadastro
      "perPage": 15, // Total de registros a ser listado na pagina de consulta
      "isReport": false, // Se o headers é utilizado em um relatório
      "templateTableUrl": "app/modules/carros/carros.html", // Template utilizado na tela de consulta
      "tableClass": "table-carros", // Classe adicionada na tabela de consulta
      "subtitle": "Tabela listando apenas carros importados", // Texto exibido abaixo do titulo na tela de consulta
      "export": false, // Exibe o botão exportar na tela de consulta
      "search": "fixed", // mantem a busca fixa na tela de consulta
      "disabled": false, // Desabilita o formulário de cadastro

      // Configurações das telas
      "settings": {
        "add": true, // Exibe o botão de novo registro
        "edit": true, // Exibe o botão de editar
        "delete": true, // Exibe o botão de excluir
        "sort": { "sortKey": "nome", "order": "asc" }, // Ordenação dos registros na tela de consulta
        "filterScope": "importados" // Filtra os registros da consulta conforme scope definido no backend
      },

      // Seta todos os campos do modelo
      "fields": [

        // Number or Integer
        {
          "name": "id", // Nome do campo no backend
          "type": "number", // Tipo do campo (number)
          "size": 2, // Tamanho do input no formulário de cadastro
          "filter": { "size": 2, "customClass": "class-input", "required":false }, // Exibe o campo nos filtros / Tamanho do input / Add Nova classe
          "notnull": true, // Seta de o campo é obrigatório
          "label": "ID", // Nome legivel do campo
          "editable": false, // Exibe na tela de cadastro
          "viewable": true // Exibe o campo na tela de consulta
        },

        // String
        {
          "name": "nome",
          "type": "string", // Tipo do campo (string)
          "notnull": true,
          "label": "Nome",
          "editable": true,
          "viewable": true
        },

        // Autocomplete
        {
          "name": "marca",
          "type": "string", // Tipo do campo (string)
          "notnull": true,
          "label": "Marca",
          "editable": true,
          "viewable": true,
          "autocomplete": true, // Seta o campo como autocomplete
          "autocomplete_dependencies": [ // Permite uma ou mais dependências
            { field: 'pais', label: 'País', gender: 'o' } // campo dependencia / label caso não selecionado / genero:(o,a)
          ],
          "help": "Será listado apenas as marcas do país informado.", // Exibe um icone informativo ao lado do input
          "customOptions": {
            "select": true // Quando setado essa opção, o campo não permite busca por digitação
          }
        },

        // Boolean
        {
          "name": "status",
          "type": "boolean", // Tipo do campo (boolean)
          "notnull": true,
          "label": "Status",
          "editable": true,
          "viewable": true,
          "customOptions": [
            "statusTrueText": "Sim", // Texto exibido quando o valor é TRUE
            "statusFalseText": "Não", // Texto exibido quando o valor é FALSE
            "default": true // Valor padrão ao iniciar o input
          ]
        },

        // Date
        {
          "name": "data_venda",
          "type": "date", // Tipo do campo (date)
          "notnull": true,
          "label": "Data de Venda",
          "editable": true,
          "viewable": true
        },

        // Currency
        {
          "name": "preco",
          "type": "float", // Tipo do campo (float)
          "notnull": true,
          "label": "Preço",
          "editable": true,
          "viewable": true,
          "customOptions": {
            "currency": true, // Exibe o input com o formato de moeda
          }
        },

        // CNPJ 
        {
          "name": "cnpj",
          "type": "string", // Tipo do campo (string)
          "notnull": false,
          "label": "CNPJ",
          "editable": true,
          "viewable": true,
          "customOptions": {
            "cnpj": true // Seta a mascara para CNPJ
          }
        },

        // CPF 
        {
          "name": "cpf",
          "type": "string", // Tipo do campo (string)
          "notnull": false,
          "label": "CPF",
          "editable": true,
          "viewable": true,
          "customOptions": {
            "cpf": true // Seta a mascara para CPF
          }
        },

        // CPF/CNPJ
        {
          "name": "documento",
          "type": "string", // Tipo do campo (string)
          "notnull": true,
          "label": "Documento",
          "editable": true,
          "viewable": true,
          "customOptions": {
            "documento": true // Seta a mascara dinamica para cpf ou cnpj
          }
        },

        // Textarea
        {
          "name": "conteudo",
          "type": "text", // Tipo do campo (text)
          "notnull": true,
          "length": null,
          "label": "Conteudo",
          "editable": false,
          "viewable": false
        },

        // Ckeditor
        {
          "name": "conteudo",
          "type": "text", // Tipo do campo (text)
          "notnull": true,
          "length": null,
          "label": "Conteudo",
          "editable": false,
          "viewable": false,
          "customOptions": {
            "rich": true // Transforma o textarea em ckeditor
          }
        },

        // E-mail
        {
          "name": "email",
          "type": "string", // Tipo do campo (string)
          "notnull": true,
          "label": "E-mail",
          "editable": true,
          "viewable": false,
          "customOptions": {
            "email": true // Valida o campo como e-mail
          }
        },

        // Float
        {
          "name": "peso",
          "type": "float", // Tipo do campo (float)
          "notnull": true,
          "label": "peso",
          "editable": true,
          "viewable": true,
        },

        // List
        {
          "name": "mes",
          "type": "number", // Tipo do campo (number ou string)
          "notnull": true,
          "label": "Mês",
          "editable": true,
          "viewable": true,
          "autocomple": true, // Seta o campo como autocomplete
          "customOptions": {
            "select": true, // Seta como input select
            "list": [ // Array de objetos com id e label
              { "id": 1, "label": "Janeiro" },
              { "id": 2, "label": "Fevereiro" },
              { "id": 3, "label": "Março" },
              { "id": 4, "label": "Abril" },
              { "id": 5, "label": "Maio" },
              { "id": 6, "label": "Junho" },
              { "id": 7, "label": "Julho" },
              { "id": 8, "label": "Agosto" },
              { "id": 9, "label": "Setembro" },
              { "id": 10, "label": "Outubro" },
              { "id": 11, "label": "Novembro" },
              { "id": 12, "label": "Dezembro" },
            ]
          }
        },

        // Password
        {
          "name": "senha",
          "type": "password", // Tipo do campo (password)
          "notnull": true,
          "label": "Senha",
          "editable": true,
          "viewable": false
        },

        // Time
        {
          "name": "hora",
          "type": "time", // Tipo do campo (time)
          "notnull": true,
          "label": "Hora",
          "editable": true,
          "viewable": true
        },

        // Upload
        {
          "name": "anexo",
          "type": "string", // Tipo do campo (string)
          "notnull": true,
          "label": "Anexo",
          "editable": true,
          "viewable": false,
          "customOptions": {
            "file": {
              "container": "anexos" // Diretório onde sera salvo os arquivos
            }
          }
        },

        // Drag and Drop Upload
        {
          "name": "anexo",
          "type": "string", // Tipo do campo (string)
          "notnull": true,
          "label": "Anexo",
          "editable": true,
          "viewable": false,
          "customOptions": {
            "file": {
              "container": "anexos", // Diretório onde sera salvo os arquivos
              "preview": true, // Exibe um preview da imagem carregada
              "dad": true, // Seta o campos como drag and drop
              "resize": { width: 100, height: 100, centerCrop: true },
              "validade": { size: { max: '20MB', min: '10B' }, height: { max: 12000 }, width: { max: 12000 } },
              "acceptedFiles": ["image/*"]
              // https://github.com/danialfarid/ng-file-upload/blob/master/README.md#full-reference
            }
          }
        },

        // Custom
        {
          "name": "cadastrado",
          "type": "custom", // Tipo do campo (string)
          "notnull": false,
          "label": "Cadastrado em",
          "editable": false,
          "viewable": true,
          "toString": function (data) { // Função executada para exibição do campos, o retorno pode ser string ou um html
            if (data && data.createdAt) {
              return moment(data.createdAt).format('DD/MM/YYYY HH:mm');
            }
          }
        }
      ],

      // Quando true, é obrigatório a propriedade "tab" no field onde o valor será: ['fixed' ou index da aba criada no main_tabs]
      "fixed_tab": true,

      // Abas fixas criadas no formulário de cadastro
      "main_tabs": ["Aba 2", "Aba 3", "Aba 4"],

      // Abas que o dados são enviados no mesmo formulário, sem a necessidade de uma rota de detalhe
      "tabs_session": {
        "revisoes": {
          "hide": false,
          "route_detail": "carros/details/revisoes", // Utilizado para listagem do autocomple quando a rota é diferente
          "label": "Revisões",
          "label_row": "revisao",
          "modal_id": "carro_revisao", // ID do modal de cadastro, utilizado em eventos de open
          "auto_layout": true,
          "fields": [
            // Campos conforme exemplos acima
          ]
        }
      },

      // Configuração de abas
      "tabs": {
        "revisoes": {
          "hide": false, // Configura e exibição da aba
          "label": "Revisões",
          "label_row": "revisao",
          "modal_id": "carro_revisao", // ID do modal de cadastro, utilizado em eventos de open
          "auto_layout": true,
          "sort": { "sortKey": "ordem", "order": "asc" }, // Ordenação dos registros
          "fields": [
            // Campos conforme exemplos acima
          ],
          "route": "/details/revisoes" // Rota utilizada no backend
        }
      },

      // Botoẽs de acões na tela de consulta
      "actions": {
        "clonar": {
          "label": "Clonar", // Nome do botão
          "class": "fa fa-clone", // icone do botão
          "function": "clonar" // Função criada no scope
        }
      }
    }

    headersProvider.set('carros', _headers);
  }

})();
```

# Modules

Possiveis parâmetros e eventos utlizados nos controladores

```js
(function () {
  'use strict';

  // Angular.js
  var module = angular.module('singApp.carros', [
    'letsAngular'
  ]);

  // Controlador da tela de listagem
  module.controller('CarroListController', function ($scope, module, $controller, auth) {
    $controller('CRUDController', { $scope: $scope, module: module }); // implementa o controlador do FW. Exemplo de herança

    // Evento emitido quando é criado a tabela de consulta
    // Através desse evento é possivel acessar o scope da tabela e implementar os actions definidos no headers
    $scope.$on('create:grid', function (evt, scope) {
      // Função definida no headers
      scope.clonar = function (data) {
        console.log(data); // Dados da linha especifica
      }
    });

  });

  // Controlador de cadastro e edição
  module.controller('CarroController', function ($scope, module, $controller, $rootScope, auth) {
    $controller('CRUDEditController', { $scope: $scope, module: module }); // implementa o controlador do FW. Exemplo de herança

    // Valida de o usuário esta logado
    if (!auth.isAuthenticated()) {
      console.log('authenticated');
    }

    // Template inserido antes do formulário
    $scope.beforeForm = 'app/modules/carros/preview-carro.html';

    // Template inserido após do formulário
    $scope.afterForm = 'app/modules/carros/preview-carro.html';

    // Evento emitido quando aberto a tela de cadastro
    $scope.$on('data-new', function () {

    });

    // Evento emitido quando aberto a tela de edição
    $scope.$on('data-loaded', function () {

    });

    // Evento emitido antes de salvar os dados
    $scope.$on('before save', function (event, next) {
      next(); // Continua a execução padrão do FW
    });

    // Evento emitido após de salvar os dados
    $scope.$on('after save', function (event, next, resp, typeSave) {
      next(); // Continua a execução padrão do FW
      resp; // Response do backend
      typeSave; // Tipo do evento: new ou edit
    });


    // Evento emitido quando é selecionado um valor no autocomplete
    // Nome do evento: autocomplete-select-{{NOME_CAMPO}}
    $scope.$on('autocomplete-select-pais', function (evt, params) {
      console.log(params); // dados do formulário e scope
    });

    // Evento emitido quando é criado a tabela de consulta da tab
    // Através desse evento é possivel acessar o scope da tabela e implementar os actions definidos no headers
    // Nome do evento: create:{{NOME_ABA}}
    $scope.$on("create:carros", function (evt, scope) {

    });

    // Evento emitido quando é aberto o modal com o formulário da tab
    // Nome do evento: open:{{MODAL_ID}}
    $scope.$on('open:carro_revisao', function (evt, scope) {
      console.log(scope); // scope do formulário de cadastro da tab

      // Evento emitido quando aberto a tela de cadastro da tab
      scope.$on('data-new-detail', function () {

      });

      // Evento emitido quando aberto a tela de edição da tab
      scope.$on('data-loaded-detail', function () {

      });

    });

    // Atualiza as tabelas de consultas
    $rootScope.$broadcast('refreshGRID');

  });



  // Configurações de rotas padrão do FW
  module.config(appConfig);
  appConfig.$inject = ['$stateProvider', 'fwStateProvider'];
  function appConfig($stateProvider, fwStateProvider) {
    var settings = {
      route: 'carros', // Rota do backend
      modelName: 'carros', // Nome do modulo definido no frontend | Ex: singApp.carros
      options: {

        // Rota principal | Ex: app.carros
        main: {
          enable: false, // Ativa ou desabilita a rota
          controller: 'CarroMainController', // Nome do controlador
          templateUrl: 'app/modules/carros/carros-main.html', // Template utilizado na rota
        },

        // Rota de consulta | Ex: app.carros.list
        list: {
          controller: 'CarroListController'
        },

        // Rota edição | Ex: app.carros.edit
        edit: {
          controller: 'CarroController'
        },

        // Rota de cadastro | Ex: app.carros.new
        new: {
          controller: 'CarroController'
        }
      }
    };

    fwStateProvider.setCRUDRoutes(settings, $stateProvider);
  };


})();
```
