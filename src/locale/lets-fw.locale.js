(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.config(function(localeProvider){

        localeProvider.addCatalog('letsfw',{
            "save":{
                "pt-br":"Salvar",
                "en":"Save",
                "es":"Guardar"
            },
            "cancel":{
                "pt-br":"Cancelar",
                "en":"Cancel",
                "es":"Cancelar"
            },
            "ok":{
                "pt-br":"Ok",
                "en":"OK",
                "es":"Feito"
            },
            "editar":{
                "pt-br":"Editar",
                "en":"Edit",
                "es":"Editar"
            },
            "excluir":{
                "pt-br":"Excluir",
                "en":"Delete",
                "es":"Eliminar"
            },
            "select":{
                "pt-br":"Selecione",
                "en":"Select",
                "es":"Seleccione"
            },
            "is_blank":{
                "pt-br":"[Em Branco]",
                "en":"[Is blank]",
                "es":"[En blanco]"
            },
            "select_before":{
                "pt-br":"Selecione antes %gender% %name%",
                "en":"Select %name% first",
                "es":"Seleccione %name% primero"
            },
            "no_record_found":{
                "pt-br":"Nenhum registro encontrado.",
                "en":"No records found.",
                "es":"No se encontraron registros."
            },
            "add_new":{
                "pt-br":"Adicionar novo",
                "en":"Add new",
                "es":"Agregar nuevo"
            },
            "message_delete":{
                "pt-br":"Deseja realmente excluir esse registro?",
                "en":"Do you really want to delete this record?",
                "es":"¿Desea realmente excluir este registro?"
            },
            "actions":{
                "pt-br":"Ações",
                "en":"Actions",
                "es":"Acciones"
            },
            "records_page":{
                "pt-br":"Registros na página",
                "en":"Records on page",
                "es":"Registros en la página"
            },
            "search":{
                "pt-br":"Buscar",
                "en":"Search",
                "es":"Buscar"
            },
            "search_by":{
                "pt-br":"Buscar por",
                "en":"Search by",
                "es":"Buscar"
            },
            "search_advanced":{
                "pt-br":"Busca Avançada",
                "en":"Advanced search",
                "es":"Búsqueda Avanzada"
            },
            "clear_filter":{
                "pt-br":"Limpar Filtro",
                "en":"Clear Filter",
                "es":"Filtro claro"
            },
            "new_record":{
                "pt-br":"Novo Registro",
                "en":"New Record",
                "es":"Nuevo Record"
            },
            "main_information":{
                "pt-br":"Informações Principais",
                "en":"Main Information",
                "es":"Información Principal"
            },
            "first":{
                "pt-br":"Primeiro",
                "en":"First",
                "es":"Primero"
            },
            "previous":{
                "pt-br":"Anterior",
                "en":"Previous",
                "es":"Anterior"
            },
            "next":{
                "pt-br":"Próximo",
                "en":"Next",
                "es":"Próximo"
            },
            "last":{
                "pt-br":"Último",
                "en":"Last",
                "es":"Último"
            }
        })


    });


})();