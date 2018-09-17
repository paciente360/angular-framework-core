Lets Comunica Angular Framework Core
=============

This repository was organized within the [AngularJS 1.4.1](https://docs.angularjs.org/api) framework. This repo covers all the core functionalities that our company front-end projects basically needs.

Author: Lets Comunica

E-mail: fabio@letscomunica.com.br

**LAST VERSION: 0.0.20**

Installation
=====

Install in you angular project:

```bash
  npm install --save git+ssh://git@bitbucket.org/letscomunicadev/angular-framework-core.git#v0.0.20
```

Functionalities
===== 
  This list shows the current supported functionalities.
  In order to use one of those just follow the necessary steps, pay attention on the highlighted lines.

## Autocomplete
  With this feature, if corrected configured on backend, you can set fields to show the values of foreign keys.

  Just use *true* on *autocomplete* key, inside your fields options:
  ```javascript
  {
    "name": "fieldName",
    "type": "fieldType",
    "notnull": true,
    "length": null,
    "precision": 100,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    -> "autocomplete": true,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## Autocomplete Table
  Same of autocomplete but with tables.

  Set the autocomplete key as true and use *autocomplete_table* on customOptions. It expects 'table_name' and 'table_columns' as keys:
  ```javascript
  {
    "name": "fieldName",
    "type": "string",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    -> "autocomplete": true,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "autocomplete_table": {
      |   "table_name": "medicamentos",
      |   "table_columns": [
      |     {
      |       "name": "nome_apresentacao",
      |       "label": "Descrição do Produto"
      |     },
      |     {
      |       "name": "tipo.label",
      |       "label": "Tipo"
      |     },
      |     {
      |       "name": "tarja.label",
      |       "label": "Tarja"
      |     }
      |   ]
      -> }
    }
  }
  ```
## Boolean
  Simple boolean type input, with toogle.

  Just use *boolean* on *type* key, inside your fields options:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "boolean",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## CNPJ
  Masked input for CNPJ.

  Set the *type* key as *string* and use *cnpj* as *true* on the customOptions key:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "string",
    "notnull": false,
    "length": 100,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "cnpj": true
    }
  }
  ```
## CPF
  Masked input for CPF.

  Set the *type* key as *string* and use *cpf* as *true* on the customOptions key:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "string",
    "notnull": false,
    "length": 100,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "cpf": true
    }
  }
  ```
## CPF/CNPJ
  With this feature the masked input accepts either CPF or CNPJ, according to its lenght.

  Set the *type* key as *string* and use *documento* as *true* on the customOptions key:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "string",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "CPF/CNPJ",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "documento": true
    }
  }
  ```
## Ckeditor
  With this feature you can use a rich text editor.

  Set the *type* key as *text* and use *rich* as *true* on the customOptions key.
  ```javascript
  {
    "name": "fieldName",
    -> "type": "text",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": false,
    "viewable": false,
    "autocomplete": false,
    "quickAdd": false,
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "rich":true
    }
  }
  ```
## Currency
  Masked input for BRL currency values.

  Set the *type* key as *float* and use *currency* as *true* on the customOptions key.
  ```javascript
  {
    "name": "fieldName",
    -> "type": "float",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "currency": true,
    }
  }
  ```
## Custom
  On this functionality you can create anything, the example below shows a button that only appears on data listing and formats a text that can be used as email.

  In order to use it set *type* key as *custom* and "make" it on *toString* key:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "custom",
    "notnull": false,
    "length": null,
    "precision": null,
    "label": "fieldLabel",
    "editable": false,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": [],
    -> "toString": function (model) {
    |    var btn = $('<button class="btn btn-default" onclick=""><span class="glyphicon glyphicon-copy"></span></button>');
    |    var messageWindow;
    |    var corpo = model.attributes.corpo;
    |    
    |    btn.click(function () {
    |        messageWindow = window.open("", "messageWindow", "width=600, height=400");
    |        messageWindow.document.write("<pre>" + corpo + "</pre>");
    |    });
    |    return btn;
    -> }
  }
  ```
## Date
  A masked input with date picker.

  Just use *date* as *type*.
  ```javascript
  {
    "name": "fieldName",
    -> "type": "date",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## Drag and Drop Upload
  A drag and drop field for file uploads.

  In order to use it set *type* key as *string*, use *dad* as *true* on the customOptions key and fill *file* object with 'container' and 'acceptedFiles' values, *container* must be a folders name and *acceptedFiles* a fileType:
  ```javascript
  {
    "name": "lan_anexo",
    -> "type": "string",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "Anexo",
    "editable": true,
    "viewable": false,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "dad": true,
      |  "file": {
      |    "container": "anexos",
      |    "acceptedFiles": ".pdf"
      -> }
    }
  }
  ```
## Email
  Set the *type* key as *string* and use *email* as *true* on the customOptions key:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "string",
    "notnull": true,
    "length": 100,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": false,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "email": true
    }
  }
  ```
## Float
  A simple float input

  Just set the *type* key as *float* and you are good to go:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "float",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## List
  A select field with custom labels.

  Fill the "*type*" key with the value "*number*", set "*autocomplete*" as *true* and create your list on "*customOptions*" key as below:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "number",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldName",
    "editable": true,
    "viewable": true,
    -> "autocomplete": true,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
        -> "list":[
        |    {"id":1, "label":"Janeiro"},
        |    {"id":2, "label":"Fevereiro"},
        |    {"id":3, "label":"Março"},
        |    {"id":4, "label":"Abril"},
        |    {"id":5, "label":"Maio"},
        |    {"id":6, "label":"Junho"},
        |    {"id":7, "label":"Julho"},
        |    {"id":8, "label":"Agosto"},
        |    {"id":9, "label":"Setembro"},
        |    {"id":10, "label":"Outubro"},
        |    {"id":11, "label":"Novembro"},
        |    {"id":12, "label":"Dezembro"},
        |  ],
        -> "select":true
    }
  }
  ```
## Number or Integer
  A number input.

  Just set the *type* key as *number* or *integer* and you are good to go:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "number",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": false,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## Number or Integer with Range
  A number input with range.

  Just set the *type* key as *number*, fill *range* object with the 'min' and 'max' values inside customOptions value and you're done:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "number",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
        -> "range": {
        |    "min": 0,
        |    "max": 10000
        -> }
    }
  }
  ```
## Password
  Password input.

  Just set the *type* key as *password* and you are good to go:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "password",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": false,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## Simplecolor
  A simple color picker.

  Set the *type* key as *simplecolor* and fill *colors* array with the desired colors:
  ```javascript
  {
    "name": "cor",
    -> "type": "simplecolor",
    "notnull": false,
    "length": null,
    "precision": 10,
    "label": "Sinalização",
    "editable": true,
    "viewable": false,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> colors: ['green', 'yellow', 'orange', 'red']
    }
  }
  ```
## String
  Just set the *type* key as *string* and you are good to go:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "string",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## Tags
  I really didn't understand this functionality, fell free to discover and write about it.
## Textarea
  Just set the *type* key as *text* and you are good to go:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "text",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## Time
  A time picker.

  Just set the *type* key as *time*:
  ```javascript
  {
    "name": "fieldName",
    -> "type": "time",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "fieldLabel",
    "editable": true,
    "viewable": true,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": []
  }
  ```
## Upload
  File upload field with simple button.

  In order to use it set *type* key as *string* and fill *file* object, *container* must be a folders name:
  ```javascript
  {
    "name": "lan_anexo",
    -> "type": "string",
    "notnull": true,
    "length": null,
    "precision": 10,
    "label": "Anexo",
    "editable": true,
    "viewable": false,
    "autocomplete": false,
    "quickAdd": [],
    "autocomplete_dependencies": [],
    "customOptions": {
      -> "file": {
      |    "container": "anexos"
      -> }
    }
  }
  ```

Updates
=====

Made a modification or added a new feature? Test it at least in one project before submiting a version. It still needs unit testing and CI with projects. After everything seems perfectly up-to-date, don't forget to UPDATE THE README file and only then run the following steps:

1\. Commit and push your updates using Let's Bitbucket credentials

2\. Change and commit a new tag version (always check and update the last version here and in package.json):

```bash
$ git tag -a vX.X.X -m "version_message"
```

3\. Push the new tag version to remote repository:

```bash
$ git push origin vX.X.X  # Version needs to be the same from commit
```

4\. Run npm installation with the newest version:

```bash
  npm install --save git+ssh://git@bitbucket.org/letscomunicadev/angular-framework-core.git#vX.X.X
```

Todo
----------
1\. Convert ng-includes from URL images to directives (in order to access templates from inside this module)

2\. Start gulp automation to render all src files to single lets-angular-framework-core.module.js in a minified version

3\. Separate input types in different directives

4\. Isolate scope to vm and change all scope parents and childs access

History
----------

**v0.0.20**

[09/06/18] Started repository
