var urlBase="./api/atencionesTuristicas/";

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
    CargarProvinciasSelect();
    CargarMotivosSelect();
    CargarPaisesSelect();

});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarPaisesSelect = () => {
    $("#paisOrigen").empty();
    $.post(urlBase+"ObtenerPaisesSelect")
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
          { data: 'date_tourist_attentions' },
          { data: 'id_user_tourist_attention' },
          { data: 'motivo_attention' },
          { data: 'quantity_people_tourist_attention' },
          { data: 'pais_attention' },
          { data: 'name_province' },
          { data: 'id_origin_tourist_attention' },
          { data: 'details_tourist_attentions' },
          { data: 'acciones_tourist_attentions' },
        ]
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

const CargarMotivosSelect = () => {
    $("#motivoConsulta_new").empty();
    $.post(urlBase+"ObtenerMotivosSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_motivo+"'>"+e.nombre_motivo.toUpperCase()+"</option>";
        $("#motivoConsulta_new").append(opcion);
      })
    });
}

const CargarCiudadesSelect = () => {
    idProvincia = $("#province_new").val();
    if(idProvincia){
        $("#id_origin_tourist_attention_new").empty();
        $.post(urlBase+"ObtenerCiudadesSelect",{idProvincia})
        .then((data)=>{
          data=JSON.parse(data);
          data.forEach((e)=>{
              var opcion = "<option value='"+e.id_city+"'>"+e.name_city.toUpperCase()+"</option>";
            $("#id_origin_tourist_attention_new").append(opcion);
          })
        });
    }
   
}

const GuardarAtencion = () => {
    id_origin_tourist_attention = $("#id_origin_tourist_attention_new").val();
    quantity_people_tourist_attention = $("#quantity_people_tourist_attention_new").val();
    details_tourist_attentions = $("#details_tourist_attentions_new").val();
    idMotivo = $("#motivoConsulta_new").val();
    pais = $("#paisOrigen").val();
    if(id_origin_tourist_attention && quantity_people_tourist_attention){
        let datos = {
            id_origin_tourist_attention,
            quantity_people_tourist_attention,
            details_tourist_attentions,
            idMotivo,
            pais
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaAtencion",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaEncuesta").modal('hide');
                    $("#id_origin_tourist_attention_new").val("");
                    $("#quantity_people_tourist_attention_new").val("");
                    $("#quantity_days_tourist_attention_new").val("");
                    $("#details_tourist_attentions_new").val("");
                    $("#motivoConsulta_new").val("");
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