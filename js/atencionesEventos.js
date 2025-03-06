var urlBase="./api/atencionesEventos/";

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
    CargarAtenciones();
    CargarPaisesSelect();
    CargarActividadesSelect();
    CargarProvinciasSelect();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarPaisesSelect = () => {
    $("#paisOrigen").empty();
    $.post("./api/atencionesTuristicas/ObtenerPaisesSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.nombre.toUpperCase()+"'>"+e.nombre.toUpperCase()+"</option>";
        $("#paisOrigen").append(opcion);
      })
      $("#paisOrigen").val('ARGENTINA')
    });
}

const CargarAtenciones = () => {
    $('#atenciones').DataTable().destroy();
    let fechaDesde = $("#fechaDesde").val();
    let fechaHasta = $("#fechaHasta").val();
    $('#atenciones').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerAtenciones?fechaDesde='+fechaDesde+'&fechaHasta='+fechaHasta
        },
        'columns': [
          { data: 'date_events_survey' },
          { data: 'name_activity' },
          { data: 'id_user_events_survey' },
          { data: 'quantity_people_events_survey' },
          { data: 'pais_events_surveys' },
          { data: 'name_province' },
          { data: 'name_city' },
          { data: 'details_events_survey' },
          { data: 'acciones_events_survey' },
        ]
    });
}

const CargarActividadesSelect = () => {
    $("#id_activity_events_survey_new").empty();
    $.post(urlBase+"ObtenerActividadesSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_activity+"'>"+e.name_activity.toUpperCase()+"</option>";
        $("#id_activity_events_survey_new").append(opcion);
      })
    });
}

const CargarProvinciasSelect = () => {
    $("#province_new").empty();
    $.post(urlBase+"ObtenerProvinciasSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_province+"'>"+e.name_province.toUpperCase()+"</option>";
        $("#province_new").append(opcion);
      })
      CargarCiudadesSelect();
    });
}

const CargarCiudadesSelect = () => {
    idProvincia = $("#province_new").val();
    if(idProvincia){
        $("#id_origin_events_survey_new").empty();
        $.post(urlBase+"ObtenerCiudadesSelect",{idProvincia})
        .then((data)=>{
          data=JSON.parse(data);
          data.forEach((e)=>{
              var opcion = "<option value='"+e.id_city+"'>"+e.name_city.toUpperCase()+"</option>";
            $("#id_origin_events_survey_new").append(opcion);
          })
        });
    }
   
}

const GuardarAtencion = () => {
    id_activity_events_survey = $("#id_activity_events_survey_new").val();
    id_origin_events_survey = $("#id_origin_events_survey_new").val();
    quantity_people_events_survey = $("#quantity_people_events_survey_new").val();
    details_events_survey = $("#details_events_survey_new").val();
    paisOrigen = $("#paisOrigen").val();
    if(id_activity_events_survey && id_origin_events_survey, quantity_people_events_survey){
        let datos = {
            id_activity_events_survey,
            id_origin_events_survey,
            quantity_people_events_survey,
            details_events_survey,
            paisOrigen
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaAtencion",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaEncuesta").modal('hide');
                    $("#id_activity_events_survey_new").val("");
                    $("#id_origin_events_survey_new").val("");
                    $("#quantity_people_events_survey_new").val("");
                    $("#details_events_survey_new").val("");
                    $("#paisOrigen").val("");
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Atencion creada con éxito.',
                    });
                    table =   $("#atenciones").DataTable();
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
                    msg: 'Error al Crear. Contacte a Soporte.',
                    });
                }
            });      
    }else{
        Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-message-error',
        msg: 'Faltan campos por completar.',
        });
    }
}

const EliminarAtencion = (idAtencion) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar esta encuesta?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarAtencion",{idAtencion})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Encuesta eliminada con éxito.',
            });
            table =   $("#atenciones").DataTable();
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

const verificarPaisOrigen = async () => {
    let origen = $("#paisOrigen").val();
    if(origen !="ARGENTINA"){
        $(".argentina").prop('hidden',true);
    }else{
        $(".argentina").prop('hidden',false);
    }
}