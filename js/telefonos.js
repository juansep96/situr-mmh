var urlBase="./api/telefonos/";

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
    cargarTelefonos();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


const cargarTelefonos = () => {
    $('#telefonos').DataTable().destroy();    
    $('#telefonos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerTelefonos'
        },
        'columns': [
          { data: 'ente_tel' },
          { data: 'telefono_tel' },
          { data: 'mail_tel' },
          { data: 'horario_tel' },
          { data: 'direccion_tel' },
          { data: 'detalle_tel' },
          { data: 'acciones_tel' },
        ]
    });
}


const guardarTelefono = () => {
    ente = $("#ente_tel_new").val();
    telefono = $("#telefono_tel_new").val();
    mail = $("#mail_tel_new").val();
    horario = $("#horario_tel_new").val();
    direccion = $("#direccion_tel_new").val();
    detalle = $("#detalle_tel_new").val();
    if(ente && telefono){
        let datos = {
            ente,
            telefono,
            mail,
            horario,
            direccion,
            detalle
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoTelefono",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#ente_tel_new").val('');
                    $("#telefono_tel_new").val('');
                    $("#mail_tel_new").val('');
                    $("#horario_tel_new").val('');
                    $("#direccion_tel_new").val('');
                    $("#detalle_tel_new").val('');
                    $("#modalNuevoTelefono").modal('hide');

                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Telefono creado con éxito.',
                    });
                    table =   $("#telefonos").DataTable();
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

const EditarTelefono = (idTelefono) => {
    $.post(urlBase+"ObtenerTelefono",{idTelefono})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#ente_tel_edit").val(e.ente_tel);
        $("#telefono_tel_edit").val(e.telefono_tel);
        $("#mail_tel_edit").val(e.mail_tel);
        $("#horario_tel_edit").val(e.horario_tel);
        $("#direccion_tel_edit").val(e.direccion_tel);
        $("#detalle_tel_edit").val(e.detalle_tel);
        $("#idTelefono_edit").val(e.id_tel);
      });
      $("#modalEditarTelefono").modal('show');
    });
}

const actualizarTelefono = () => {
    idTelefono = $("#idTelefono_edit").val();
    ente = $("#ente_tel_edit").val();
    telefono = $("#telefono_tel_edit").val();
    mail = $("#mail_tel_edit").val();
    horario = $("#horario_tel_edit").val();
    direccion = $("#direccion_tel_edit").val();
    detalle = $("#detalle_tel_edit").val();
    if(ente && telefono){
        let datos = {
            ente,
            telefono,
            mail,
            horario,
            direccion,
            detalle,
            idTelefono
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"ActualizarTelefono",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#ente_tel_edit").val('');
                    $("#telefono_tel_edit").val('');
                    $("#mail_tel_edit").val('');
                    $("#horario_tel_edit").val('');
                    $("#direccion_tel_edit").val('');
                    $("#detalle_tel_edit").val('');
                    $("#modalEditarTelefono").modal('hide');             
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Telefono actualizado con éxito.',
                    });
                    table =   $("#telefonos").DataTable();
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

const EliminarTelefono = (idTelefono) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este telefono?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarTelefono",{idTelefono})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Telefono eliminado con éxito.',
            });
            table =   $("#telefonos").DataTable();
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
