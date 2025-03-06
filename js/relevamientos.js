var urlBase="./api/relevamientos/";
var items = [];
var itemsNuevos = [];
$(document).ready(function() {  
    $("#fechaDesde").val(moment().format('YYYY-MM-DD'));
    $("#fechaHasta").val(moment().format('YYYY-MM-DD'));
    $.extend( true, $.fn.dataTable.defaults, {
        "language": {
            "decimal": ",",
            "thousands": ".",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoPostFix": "",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "loadingRecords": "Cargando...",
            "lengthMenu": "Mostrar _MENU_ registros",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "processing": "Procesando...",
            "search": "Buscar:",
            "searchPlaceholder": "",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "aria": {
                "sortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            //only works for built-in buttons, not for custom buttons
            "buttons": {
                "create": "Nuevo",
                "edit": "Cambiar",
                "remove": "Borrar",
                "copy": "Copiar",
                "csv": "CSV",
                "excel": "Excel",
                "pdf": "PDF",
                "print": "Imprimir",
                "colvis": "Visibilidad columnas",
                "collection": "Colección",
                "upload": "Seleccione fichero...."
            },
            "select": {
                "rows": {
                    _: '%d filas seleccionadas',
                    0: 'clic fila para seleccionar',
                    1: 'una fila seleccionada'
                }
            }
        }
    } );
    CargarRelevamientos();
});


const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarRelevamientos = () => {
    $('#relevamientos').DataTable().destroy();
    let fechaDesde = $("#fechaDesde").val();
    let fechaHasta = $("#fechaHasta").val();
    $('#relevamientos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerRelevamientos?fechaDesde='+fechaDesde+'&fechaHasta='+fechaHasta
        },
        'columns': [
          { data: 'datetime_daily_survey' },
          { data: 'turn_daily_survey' },
          { data: 'available_daily_survey' }, //Esto se calcula en el mismo archivo backend en base a la disponibilidad de cada hotel promediado
          { data: 'last_update_daily_survey' },
          { data: 'details_daily_survey' },
          { data: 'lastname_user' },
          { data: 'acciones_daily_survey' },
        ]
    });
}

const VerRelevamiento = (idRelevamiento) => {
    $(".filaDetalle").remove();
    $.post(urlBase+"ObtenerRelevamiento",{idRelevamiento})
    .then((data) => {
        if(data){
            data = JSON.parse(data);
            cabecera = data[0];
            $("#last_update").html(moment(cabecera.last_update_daily_survey).format("DD/MM/YYYY H:s"));
            data.forEach((e) => {
                disponibilidad = parseFloat(e.quantity_guest_available_daily_surveys_item) / parseFloat(e.quantity_guest_total_daily_surveys_item);
                disponibilidad = disponibilidad*100;
                htmlTags = '<tr class="filaDetalle">' +
                            '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                            '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                            '<td>' + e.phone_accomodation + '</td>'+
                            '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                            '<td>' + e.quantity_single_room_daily_surveys_item + '</td>'+
                            '<td>' + e.quantity_double_room_daily_surveys_item + '</td>'+
                            '<td>' + e.quantity_triple_room_daily_surveys_item + '</td>'+
                            '<td>' + e.quantity_quadruple_room_daily_surveys_item + '</td>'+
                            '<td>' + e.quantity_quintuples_room_daily_surveys_item + '</td>'+
                            '<td>' + e.quantity_sextuples_room_daily_surveys_item + '</td>'+
                            '<td>' + e.quantity_septuples_room_daily_surveys_item + '</td>'+
                            '<td>' + e.quantity_octuples_room_daily_surveys_item + '</td>'+
                            '<td>' + disponibilidad.toFixed(2) + ' %</td>'+
                            '</tr>';
                $('#tabla-items tbody').append(htmlTags);
            })
            $("#modalVerRelevamiento").modal('show');
        }
    })
}

const EditarRelevamiento = (idRelevamiento) => {
    $(".item-nuevo").remove();
    $.post(urlBase+"ObtenerRelevamiento",{idRelevamiento})
    .then((data) => {
        if(data){
            data = JSON.parse(data);
            cabecera = data[0];
            $("#id_daily_survey_edit").val(cabecera.id_daily_survey);
            $("#last_update").html(moment(cabecera.last_update_daily_survey).format("DD/MM/YYYY H:s"));
            data.forEach(async (e) => {
                disponibilidad = parseFloat(e.quantity_guest_available_daily_surveys_item) / parseFloat(e.quantity_guest_total_daily_surveys_item);
                disponibilidad = disponibilidad*100;
                switch(e.name_accomodations_types.toLowerCase()){
                    case 'hotel':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <select class="form-control" id="simples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option></option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                    '</select></td>'+
                        '</tr>';
                    break;
                    case 'camping':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <select class="form-control" id="simples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option></option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select hidden class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                    '</select></td>'+
                        '</tr>';
                    break;
                    case 'inmobiliaria':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <select class="form-control"  id="simples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                            '<td> <select class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '</tr>';
                    break;
                    case 'hostel':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <input class="form-control" type="number" value = "0" step="1" id="simples_'+e.id_accomodation+'"></td>'+
                        '<td> <select hidden class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select hidden class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                    '</select></td>'+
                        '</tr>';
                    break;
                }
                $('#tabla-items-edit tbody').append(htmlTags);
                await completarCantidades(e);
            })
            $("#modalEditarRelevamiento").modal('show');
        }
    })
}

const completarCantidades = async (e) => {
    $("#simples_"+e.id_accomodation).val(e.quantity_single_room_daily_surveys_item);
    $("#dobles_"+e.id_accomodation).val(e.quantity_double_room_daily_surveys_item);
    $("#triples_"+e.id_accomodation).val(e.quantity_triple_room_daily_surveys_item);
    $("#cuadruples_"+e.id_accomodation).val(e.quantity_quadruple_room_daily_surveys_item);
    $("#quintuples_"+e.id_accomodation).val(e.quantity_quintuples_room_daily_surveys_item);
    $("#sextuples_"+e.id_accomodation).val(e.quantity_sextuples_room_daily_surveys_item);
    $("#septuples_"+e.id_accomodation).val(e.quantity_septuples_room_daily_surveys_item);
    $("#octuples_"+e.id_accomodation).val(e.quantity_octuples_room_daily_surveys_item);

}

const ActualizarRevelamiento = async () => {
    id_daily_survey = $("#id_daily_survey_edit").val();
    await armarJSON();
    data = JSON.stringify(items);
    $.post(urlBase+"ActualizarRelevamiento",{data})
    .then((res)=> {
        if(res=="OK"){
            items = [];
            $("#modalEditarRelevamiento").modal('hide');
            cerramosModal();
            Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Relevamiento actualizada con éxito.',
            });
            table =   $("#relevamientos").DataTable();
            let info = table.page.info();
            let page = info.page;
            table.ajax.reload();
            table.page( page ).draw( false );
        }else{
            Lobibox.notify('warning', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-message-error',
            msg: 'Error al Actualizar. Contacte a Soporte.',
            });
        }
    })    
}

const armarJSON = async () => {
    id_survey_daily_surveys_item = $("#id_daily_survey_edit").val();
    $(".item-nuevo").each(function(index) {
        id_accomodation = $(this).attr('id');
        id_daily_surveys_item =  $(this).attr('class');
        id_daily_surveys_item = id_daily_surveys_item.replace('item-nuevo ','');
        quantity_guest_total_daily_surveys_item = $(this).attr('value');
        quantity_single_room_daily_surveys_item = $("#simples_"+id_accomodation).val();
        quantity_double_room_daily_surveys_item = $("#dobles_"+id_accomodation).val();
        quantity_triple_room_daily_surveys_item = $("#triples_"+id_accomodation).val();
        quantity_quadruple_room_daily_surveys_item = $("#cuadruples_"+id_accomodation).val();
        quantity_quintuples_room_daily_surveys_item = $("#quintuples_"+id_accomodation).val();
        quantity_sextuples_room_daily_surveys_item = $("#sextuples_"+id_accomodation).val();
        quantity_septuples_room_daily_surveys_item = $("#septuples_"+id_accomodation).val();
        quantity_octuples_room_daily_surveys_item = $("#octuples_"+id_accomodation).val();
        quantity_guest_available_daily_surveys_item = parseInt(quantity_single_room_daily_surveys_item) + parseFloat(quantity_double_room_daily_surveys_item)  *2 + parseFloat(quantity_triple_room_daily_surveys_item) * 3 + parseFloat(quantity_quadruple_room_daily_surveys_item) * 4 + parseFloat(quantity_quintuples_room_daily_surveys_item) * 5  + parseFloat(quantity_sextuples_room_daily_surveys_item) * 6  + parseFloat(quantity_septuples_room_daily_surveys_item) * 7 + parseFloat(quantity_octuples_room_daily_surveys_item) * 8;
        item = {
            id_daily_surveys_item,
            id_survey_daily_surveys_item,
            id_acomodation_daily_surveys_item:id_accomodation,
            quantity_guest_total_daily_surveys_item,
            quantity_guest_available_daily_surveys_item,
            quantity_single_room_daily_surveys_item,
            quantity_double_room_daily_surveys_item,
            quantity_triple_room_daily_surveys_item,
            quantity_quadruple_room_daily_surveys_item,
            quantity_quintuples_room_daily_surveys_item,
            quantity_sextuples_room_daily_surveys_item,
            quantity_septuples_room_daily_surveys_item,
            quantity_octuples_room_daily_surveys_item
        }
        items.push(item);        
    });
}

const EliminarRelevamiento = (idRelevamiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este relevamiento?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarRelevamiento",{idRelevamiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Relevamiento eliminado con éxito.',
            });
            table =   $("#relevamientos").DataTable();
            let info = table.page.info();
            let page = info.page;
            table.ajax.reload();
            table.page( page ).draw( false );
            });
          }else{
            Lobibox.notify('warning', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-message-error',
              msg: 'Acción cancelada.',
            });
          }
      }
      });
}

const completarPlanillaNuevoRelevamiento = () => {
    $(".item-nuevo-relevamiento").remove();
    $.post(urlBase+"ObtenerAlojamientosSelect")
    .then((data) => {
        if(data){
            data = JSON.parse(data);
            data.forEach(async (e) => {
                switch(e.name_accomodations_types.toLowerCase()){
                    case 'hotel':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <select class="form-control" id="simples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option></option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                    '</select></td>'+
                        '</tr>';
                    break;
                    case 'camping':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <select class="form-control" id="simples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option></option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select hidden class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                    '</select></td>'+
                        '</tr>';
                    break;
                    case 'inmobiliaria':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <select class="form-control"  id="simples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                            '<td> <select class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '</tr>';
                    break;
                    case 'hostel':
                        htmlTags = '<tr class="item-nuevo-relevamiento '+e.id_daily_surveys_item+'" id="'+e.id_accomodation+'" value="'+e.quantity_guest_accomodation+'">' +
                        '<td>' + e.name_accomodation.toUpperCase() + '</td>'+
                        '<td>' + e.name_accomodations_types.toUpperCase() + '</td>'+
                        '<td>' + e.phone_accomodation + '</td>'+
                        '<td>' + e.address_accomodation.toUpperCase() + '</td>'+
                        '<td> <input class="form-control" type="number" value = "0" step="1" id="simples_'+e.id_accomodation+'"></td>'+
                        '<td> <select hidden class="form-control"  id="dobles_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+  
                        '<td> <select hidden class="form-control"  id="triples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="cuadruples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="quintuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="sextuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="septuples_'+e.id_accomodation+'"> '+
                            '<option selected value="0">0</option>'+
                            '<option value="1">1</option>'+
                            '<option value="2">2</option>'+
                            '<option value="3">3</option>'+
                            '<option value="4">4</option>'+
                            '<option value="5">5</option>'+
                            '<option value="6">6</option>'+
                            '<option value="7">7</option>'+
                            '<option value="8">8</option>'+
                            '<option value="9">9</option>'+
                            '<option value="10">10</option>'+
                            '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                        '</select></td>'+
                        '<td> <select hidden class="form-control"  id="octuples_'+e.id_accomodation+'"> '+
                        '<option selected value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="7">7</option>'+
                        '<option value="8">8</option>'+
                        '<option value="9">9</option>'+
                        '<option value="10">10</option>'+
                        '<option value="11">11</option>'+
                            '<option value="12">12</option>'+
                            '<option value="13">13</option>'+
                            '<option value="14">14</option>'+
                            '<option value="15">15</option>'+
                            '<option value="16">16</option>'+
                            '<option value="17">17</option>'+
                            '<option value="18">18</option>'+
                            '<option value="19">19</option>'+
                            '<option value="20">20</option>'+
                    '</select></td>'+
                        '</tr>';
                    break;
                }
                
                $('#tabla-items-new tbody').append(htmlTags);
            })
            $("#modalNuevoRelevamiento").modal('show');
        }
    })
}

const armarJSONNuevo = async () => {
    $(".item-nuevo-relevamiento").each(function(index) {
        id_accomodation = $(this).attr('id');
        quantity_guest_total_daily_surveys_item = $(this).attr('value');
        quantity_single_room_daily_surveys_item = $("#simples_"+id_accomodation).val();
        quantity_double_room_daily_surveys_item = $("#dobles_"+id_accomodation).val();
        quantity_triple_room_daily_surveys_item = $("#triples_"+id_accomodation).val();
        quantity_quadruple_room_daily_surveys_item = $("#cuadruples_"+id_accomodation).val();
        quantity_quintuples_room_daily_surveys_item = $("#quintuples_"+id_accomodation).val();
        quantity_sextuples_room_daily_surveys_item = $("#sextuples_"+id_accomodation).val();
        quantity_septuples_room_daily_surveys_item = $("#septuples_"+id_accomodation).val();
        quantity_octuples_room_daily_surveys_item = $("#octuples_"+id_accomodation).val();

        quantity_guest_available_daily_surveys_item = parseInt(quantity_single_room_daily_surveys_item) + parseFloat(quantity_double_room_daily_surveys_item)  *2 + parseFloat(quantity_triple_room_daily_surveys_item) * 3 + parseFloat(quantity_quadruple_room_daily_surveys_item) * 4 + parseFloat(quantity_quintuples_room_daily_surveys_item) * 5  + parseFloat(quantity_sextuples_room_daily_surveys_item) * 6  + parseFloat(quantity_septuples_room_daily_surveys_item) * 7 + parseFloat(quantity_octuples_room_daily_surveys_item) * 8;
        item = {
            id_acomodation_daily_surveys_item:id_accomodation,
            quantity_guest_total_daily_surveys_item,
            quantity_guest_available_daily_surveys_item,
            quantity_single_room_daily_surveys_item,
            quantity_double_room_daily_surveys_item,
            quantity_triple_room_daily_surveys_item,
            quantity_quadruple_room_daily_surveys_item,
            quantity_quintuples_room_daily_surveys_item,
            quantity_sextuples_room_daily_surveys_item,
            quantity_septuples_room_daily_surveys_item,
            quantity_octuples_room_daily_surveys_item
        }
        itemsNuevos.push(item);        
    });
}

const GuardarNuevoAlojamiento = async () => {
    await armarJSONNuevo();
    data = JSON.stringify(itemsNuevos);
    $.post(urlBase+"NuevoRelevamiento",{data})
    .then((res)=> {
        if(res=="OK"){
            itemsNuevos = [];
            $("#modalNuevoRelevamiento").modal('hide');
            cerramosModal();
            Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Relevamiento creado con éxito.',
            });
            table =   $("#relevamientos").DataTable();
            let info = table.page.info();
            let page = info.page;
            table.ajax.reload();
            table.page( page ).draw( false );
        }else{
            Lobibox.notify('warning', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-message-error',
            msg: 'Error al Actualizar. Contacte a Soporte.',
            });
        }
    })   
}


