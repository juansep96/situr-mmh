var urlBase="./api/actividades/";

$(document).ready(function() {
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
    cargarActividades();
    cargarActividadesSelect(); //Filtrado 
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


const cargarActividades = () => {
    $('#actividades').DataTable().destroy();    
    dia = $("#dia_activity_filter").val();
    actividad = $("#nombre_activity_filter").find('option:selected').text();
    $('#actividades').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerActividades?dia='+dia+'&actividad='+actividad
        },
        'columns': [
          { data: 'name_activity' },
          { data: 'dia_activity' },
          { data: 'hora_activity' },
          { data: 'direccion_activity' },
          { data: 'valor_activity' },
          { data: 'details_activity' },
          { data: 'acciones_activity' },

        ]
    });
}

const cargarActividadesSelect = () => {
    $.post(urlBase+"ObtenerActividadesSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_activity +"'>"+e.name_activity.toUpperCase()+"</option>";
        $("#nombre_activity_filter").append(opcion);
      })
    });
}


const guardarActividad = () => {
    nombre = $("#nombre_activity_new").val();
    horario = $("#horario_activity_new").val();
    dia = $("#dia_activity_new").val();
    valor = $("#valor_activity_new").val();
    direccion = $("#direccion_activity_new").val();
    detalles = $("#detalles_activity_new").val();
    if(nombre && horario && dia && direccion){
        let datos = {
            nombre,
            hora : horario,
            dia : JSON.stringify(dia),
            valor,
            direccion,
            detalles,
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaExcursion",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#nombre_activity_new").val('');
                    $("#horario_activity_new").val('');
                    $("#dia_activity_new").val('');
                    $("#valor_activity_new").val('');
                    $("#direccion_activity_new").val('');
                    $("#detalles_activity_new").val('');
                    $("#modalNuevaActividad").modal('hide');

                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Actividad creado con éxito.',
                    });
                    table =   $("#actividades").DataTable();
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

const EditarActividad = (idActividad) => {
    $.post(urlBase+"ObtenerActividad",{idActividad})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#nombre_activity_edit").val(e.name_activity);
        $("#horario_activity_edit").val(e.hora_activity);
        $("#dia_activity_edit").val(JSON.parse(e.dia_activity));
        $("#valor_activity_edit").val(e.valor_activity);
        $("#direccion_activity_edit").val(e.direccion_activity);
        $("#detalles_activity_edit").val(e.details_activity);
        $("#idEdit_activity").val(e.id_activity);
      });
      $("#modalEditarActividad").modal('show');
    });
}

const actualizarActividad = () => {
    id_activity  = $("#idEdit_activity").val();
    nombre = $("#nombre_activity_edit").val();
    horario = $("#horario_activity_edit").val();
    dia = $("#dia_activity_edit").val();
    valor = $("#valor_activity_edit").val();
    direccion = $("#direccion_activity_edit").val();
    detalles = $("#detalles_activity_edit").val();
    if(nombre && horario && dia && direccion){
        let datos = {
            nombre,
            hora : horario,
            dia : JSON.stringify(dia),
            valor,
            direccion,
            detalles,
            id_activity 
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"ActualizarActividad",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#nombre_activity_edit").val('');
                    $("#horario_activity_edit").val('');
                    $("#dia_activity_edit").val('');
                    $("#valor_activity_edit").val('');
                    $("#direccion_activity_edit").val('');
                    $("#detalles_activity_edit").val('');          
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Actividad actualizada con éxito.',
                    });
                    $("#modalEditarActivivdad").modal('hide');

                    table =   $("#actividades").DataTable();
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

const EliminarActividad = (idActividad) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar esta actividad?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarActividad",{idActividad})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Actividad eliminada con éxito.',
            });
            table =   $("#actividades").DataTable();
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
