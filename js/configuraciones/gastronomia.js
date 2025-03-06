var urlBase="./api/configuraciones/gastronomia/";

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
    CargarTipoEstablecimientos();
    CargarServiciosEstablecimientos();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarTipoEstablecimientos = () => {
    $('#tipoEstablecimientos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerTipoEstablecimientos'
        },
        'columns': [
          { data: 'name_gastronomy_type' },
          { data: 'acciones_gastronomy_type' },
        ]
    });
}

const CargarServiciosEstablecimientos = () => {
    $('#serviciosEstablecimientos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerServiciosAlojamientos'
        },
        'columns': [
          { data: 'name_service' },
          { data: 'acciones_service' },
        ]
    });
}

const GuardarTipoEstablecimiento = () => {
    name_gastronomy_type = $("#name_gastronomy_type_new").val();
    if(name_gastronomy_type){
        let datos = {
            name_gastronomy_type
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoTipoEstablecimiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoTipoEstablecimiento").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Tipo de Establecimiento creado con éxito.',
                    });
                    $("#name_gastronomy_type_new").val('');
                    table =   $("#tipoEstablecimientos").DataTable();
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

const EditarTipoEstablecimiento = (idTipoEstablecimiento) => {
    $.post(urlBase+"ObtenerTipoEstablecimiento",{idTipoEstablecimiento})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_gastronomy_type_edit").val(e.id_gastronomy_type);
        $("#name_gastronomy_type_edit").val(e.name_gastronomy_type.toUpperCase());
      });
      $("#modalEditarTipoEstablecimiento").modal('show');
    });
}

const ActualizarTipoEstablecimiento = () => {
    id_gastronomy_type = $("#id_gastronomy_type_edit").val();
    name_gastronomy_type = $("#name_gastronomy_type_edit").val();
    if(id_gastronomy_type && name_gastronomy_type){
        let datos = {
            id_gastronomy_type,
            name_gastronomy_type
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarTipoEstablecimiento",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarTipoEstablecimiento").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Tipo de Establecimiento Gastronomico actualizado con éxito.',
                });
                table =   $("#tipoEstablecimientos").DataTable();
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

const EliminarTipoEstablecimiento = (idTipoEstablecimiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este tipo de Establecimiento Gastronomico?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarTipoEstablecimiento",{idTipoEstablecimiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Tipo de Establecimiento Gastronomico eliminado con éxito.',
            });
            table =   $("#tipoEstablecimientos").DataTable();
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

const GuardarServicioEstablecimiento = () => {
    name_service = $("#name_service_new").val();
    if(name_service){
        let datos = {
            name_service
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoServicioEstablecimiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoServicioEstablecimiento").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Servicio de Establecimiento creado con éxito.',
                    });
                    $("#name_service_new").val('');
                    table =   $("#serviciosEstablecimientos").DataTable();
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

const EditarServicioEstablecimiento = (idServicioEstablecimiento) => {
    $.post(urlBase+"ObtenerServicioAlojamiento",{idServicioEstablecimiento})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_service_edit").val(e.id_service);
        $("#name_service_edit").val(e.name_service.toUpperCase());
      });
      $("#modalEditarServicioEstablecimiento").modal('show');
    });
}

const ActualizarServicioEstablecimiento = () => {
    id_service = $("#id_service_edit").val();
    name_service = $("#name_service_edit").val();
    if(id_service && name_service){
        let datos = {
            id_service,
            name_service
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarServicioAlojamiento",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarServicioEstablecimiento").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Servicio de Establecimiento Gastronomico actualizado con éxito.',
                });
                table =   $("#serviciosEstablecimientos").DataTable();
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

const EliminarServicioEstablecimiento = (idServicioEstablecimiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este Servicio de Establecimiento Gastronomico?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarServicioEstablecimiento",{idServicioEstablecimiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Servicio de Establecimiento Gastronomico eliminado con éxito.',
            });
            table =   $("#serviciosEstablecimientos").DataTable();
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