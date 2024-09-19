(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.config(function(localeProvider){

        localeProvider.addCatalog('letsfw',{
            "save":{
                "pt-br":"Salvar",
                "en":"Save",
                "es":"Guardar",
                "fr":"Enregistrer"
            },
            "cancel":{
                "pt-br":"Voltar",
                "en":"Return",
                "es":"Regresar",
                "fr":"Retour"
            },
            "cancelar":{
                "pt-br":"Cancelar",
                "en":"Cancel",
                "es":"Cancelar",
                "fr":"Annuler"
            },
            "ok":{
                "pt-br":"Ok",
                "en":"OK",
                "es":"Feito",
                "fr":"D'accord"
            },
            "editar":{
                "pt-br":"Editar",
                "en":"Edit",
                "es":"Editar",
                "fr":"Éditer"
            },
            "excluir":{
                "pt-br":"Excluir",
                "en":"Delete",
                "es":"Eliminar",
                "fr":"Supprimer"
            },
            "select":{
                "pt-br":"Selecione",
                "en":"Select",
                "es":"Seleccione",
                "fr":"Sélectionner"
            },
            "is_blank":{
                "pt-br":"[Em Branco]",
                "en":"[Is blank]",
                "es":"[En blanco]",
                "fr":"[Vide]"
            },
            "select_before":{
                "pt-br":"Selecione antes %gender% %name%",
                "en":"Select %name% first",
                "es":"Seleccione %name% primero",
                "fr":"Sélectionnez d'abord %name%"
            },
            "no_record_found":{
                "pt-br":"Nenhum registro encontrado.",
                "en":"No records found.",
                "es":"No se encontraron registros.",
                "fr":"Aucun enregistrement trouvé."
            },
            "add_new":{
                "pt-br":"Adicionar novo",
                "en":"Add new",
                "es":"Agregar nuevo",
                "fr":"Ajouter nouveau"
            },
            "message_delete":{
                "pt-br":"Deseja realmente excluir esse registro?",
                "en":"Do you really want to delete this record?",
                "es":"¿Desea realmente excluir este registro?",
                "fr":"Voulez-vous vraiment supprimer cet enregistrement ?"
            },
            "actions":{
                "pt-br":"Ações",
                "en":"Actions",
                "es":"Acciones",
                "fr":"Actions"
            },
            "records_page":{
                "pt-br":"Registros na página",
                "en":"Records on page",
                "es":"Registros en la página",
                "fr":"Enregistrements sur la page"
            },
            "search":{
                "pt-br":"Buscar",
                "en":"Search",
                "es":"Buscar",
                "fr":"Rechercher"
            },
            "search_by":{
                "pt-br":"Buscar por",
                "en":"Search by",
                "es":"Buscar",
                "fr":"Rechercher par"
            },
            "search_advanced":{
                "pt-br":"Busca Avançada",
                "en":"Advanced search",
                "es":"Búsqueda Avanzada",
                "fr":"Recherche avancée"
            },
            "clear_filter":{
                "pt-br":"Limpar Filtro",
                "en":"Clear Filter",
                "es":"Filtro claro",
                "fr":"Effacer le filtre"
            },
            "new_record":{
                "pt-br":"Novo Registro",
                "en":"New Record",
                "es":"Nuevo Record",
                "fr":"Nouvel enregistrement"
            },
            "main_information":{
                "pt-br":"Informações Principais",
                "en":"Main Information",
                "es":"Información Principal",
                "fr":"Informations principales"
            },
            "first":{
                "pt-br":"Primeiro",
                "en":"First",
                "es":"Primero",
                "fr":"Premier"
            },
            "previous":{
                "pt-br":"Anterior",
                "en":"Previous",
                "es":"Anterior",
                "fr":"Précédent"
            },
            "next":{
                "pt-br":"Próximo",
                "en":"Next",
                "es":"Próximo",
                "fr":"Suivant"
            },
            "last":{
                "pt-br":"Último",
                "en":"Last",
                "es":"Último",
                "fr":"Dernier"
            }
        })


    });


})();