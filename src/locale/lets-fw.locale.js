(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.config(function(localeProvider){

        localeProvider.addCatalog('letsfw',{
            "save": {
                "pt-br": "Salvar",
                "en": "Save",
                "es": "Guardar",
                "fr": "Enregistrer",
                "ru": "Сохранить",
                "de": "Speichern"
            },
            "cancel": {
                "pt-br": "Voltar",
                "en": "Return",
                "es": "Regresar",
                "fr": "Retour",
                "ru": "Вернуться",
                "de": "Zurück"
            },
            "cancelar": {
                "pt-br": "Cancelar",
                "en": "Cancel",
                "es": "Cancelar",
                "fr": "Annuler",
                "ru": "Отменить",
                "de": "Abbrechen"
            },
            "ok": {
                "pt-br": "Ok",
                "en": "OK",
                "es": "Feito",
                "fr": "D'accord",
                "ru": "Ок",
                "de": "OK"
            },
            "editar": {
                "pt-br": "Editar",
                "en": "Edit",
                "es": "Editar",
                "fr": "Éditer",
                "ru": "Редактировать",
                "de": "Bearbeiten"
            },
            "excluir": {
                "pt-br": "Excluir",
                "en": "Delete",
                "es": "Eliminar",
                "fr": "Supprimer",
                "ru": "Удалить",
                "de": "Löschen"
            },
            "select": {
                "pt-br": "Selecione",
                "en": "Select",
                "es": "Seleccione",
                "fr": "Sélectionner",
                "ru": "Выбрать",
                "de": "Auswählen"
            },
            "is_blank": {
                "pt-br": "[Em Branco]",
                "en": "[Is blank]",
                "es": "[En blanco]",
                "fr": "[Vide]",
                "ru": "[Пусто]",
                "de": "[Leer]"
            },
            "select_before": {
                "pt-br": "Selecione antes %gender% %name%",
                "en": "Select %name% first",
                "es": "Seleccione %name% primero",
                "fr": "Sélectionnez d'abord %name%",
                "ru": "Сначала выберите %name%",
                "de": "Wählen Sie zuerst %name% aus"
            },
            "no_record_found": {
                "pt-br": "Nenhum registro encontrado.",
                "en": "No records found.",
                "es": "No se encontraron registros.",
                "fr": "Aucun enregistrement trouvé.",
                "ru": "Записи не найдены.",
                "de": "Keine Datensätze gefunden."
            },
            "add_new": {
                "pt-br": "Adicionar novo",
                "en": "Add new",
                "es": "Agregar nuevo",
                "fr": "Ajouter nouveau",
                "ru": "Добавить новый",
                "de": "Neu hinzufügen"
            },
            "message_delete": {
                "pt-br": "Deseja realmente excluir esse registro?",
                "en": "Do you really want to delete this record?",
                "es": "¿Desea realmente excluir este registro?",
                "fr": "Voulez-vous vraiment supprimer cet enregistrement ?",
                "ru": "Вы действительно хотите удалить эту запись?",
                "de": "Möchten Sie diesen Datensatz wirklich löschen?"
            },
            "actions": {
                "pt-br": "Ações",
                "en": "Actions",
                "es": "Acciones",
                "fr": "Actions",
                "ru": "Действия",
                "de": "Aktionen"
            },
            "records_page": {
                "pt-br": "Registros na página",
                "en": "Records on page",
                "es": "Registros en la página",
                "fr": "Enregistrements sur la page",
                "ru": "Записи на странице",
                "de": "Einträge pro Seite"
            },
            "search": {
                "pt-br": "Buscar",
                "en": "Search",
                "es": "Buscar",
                "fr": "Rechercher",
                "ru": "Поиск",
                "de": "Suchen"
            },
            "search_by": {
                "pt-br": "Buscar por",
                "en": "Search by",
                "es": "Buscar",
                "fr": "Rechercher par",
                "ru": "Поиск по",
                "de": "Suchen nach"
            },
            "search_advanced": {
                "pt-br": "Busca Avançada",
                "en": "Advanced search",
                "es": "Búsqueda Avanzada",
                "fr": "Recherche avancée",
                "ru": "Расширенный поиск",
                "de": "Erweiterte Suche"
            },
            "clear_filter": {
                "pt-br": "Limpar Filtro",
                "en": "Clear Filter",
                "es": "Filtro claro",
                "fr": "Effacer le filtre",
                "ru": "Очистить фильтр",
                "de": "Filter löschen"
            },
            "new_record": {
                "pt-br": "Novo Registro",
                "en": "New Record",
                "es": "Nuevo Record",
                "fr": "Nouvel enregistrement",
                "ru": "Новая запись",
                "de": "Neuer Datensatz"
            },
            "main_information": {
                "pt-br": "Informações Principais",
                "en": "Main Information",
                "es": "Información Principal",
                "fr": "Informations principales",
                "ru": "Основная информация",
                "de": "Hauptinformationen"
            },
            "first": {
                "pt-br": "Primeiro",
                "en": "First",
                "es": "Primero",
                "fr": "Premier",
                "ru": "Первый",
                "de": "Erster"
            },
            "previous": {
                "pt-br": "Anterior",
                "en": "Previous",
                "es": "Anterior",
                "fr": "Précédent",
                "ru": "Предыдущий",
                "de": "Vorheriger"
            },
            "next": {
                "pt-br": "Próximo",
                "en": "Next",
                "es": "Próximo",
                "fr": "Suivant",
                "ru": "Следующий",
                "de": "Nächster"
            },
            "last": {
                "pt-br": "Último",
                "en": "Last",
                "es": "Último",
                "fr": "Dernier",
                "ru": "Последний",
                "de": "Letzter"
            }
            
        })


    });


})();