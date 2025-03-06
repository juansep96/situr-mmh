var urlBase="./api/configuraciones/alojamientos/";

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
    CargarTipoAlojamientos();
    CargarCategoriasAlojamientos();
    CargarServiciosAlojamientos();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarTipoAlojamientos = () => {
    $('#tipoAlojamientos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerTiposAlojamientos'
        },
        'columns': [
          { data: 'name_accomodations_types' },
          { data: 'acciones_accomodations_types' },
        ]
    });
}

const CargarCategoriasAlojamientos = () => {
    $('#categoriasAlojamientos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerCategoriasAlojamientos'
        },
        'columns': [
          { data: 'name_categories_types' },
          { data: 'acciones_categories_types' },
        ]
    });
}

const CargarServiciosAlojamientos = () => {
    $('#serviciosAlojamientos').DataTable({
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
          { data: 'name_amenetie' },
          { data: 'acciones_amenetie' },
        ]
    });
}

const GuardarTipoAlojamiento = () => {
    name_accomodation_type = $("#name_accomodation_type_new").val();
    if(name_accomodation_type){
        let datos = {
            name_accomodation_type
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoTipoAlojamiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoTipoAlojamiento").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Tipo de Alojamiento creada con éxito.',
                    });
                    table =   $("#tipoAlojamientos").DataTable();
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

const EditarTipoAlojamiento = (idTipoAlojamiento) => {
    $.post(urlBase+"ObtenerTipoAlojamiento",{idTipoAlojamiento})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_accomodations_types_edit").val(e.id_accomodations_types);
        $("#name_accomodations_types_edit").val(e.name_accomodations_types.toUpperCase());
      });
      $("#modalEditarTipoAlojamiento").modal('show');
    });
}

const ActualizarTipoAlojamiento = () => {
    id_accomodations_types = $("#id_accomodations_types_edit").val();
    name_accomodations_types = $("#name_accomodations_types_edit").val();
    if(id_accomodations_types && name_accomodations_types){
        let datos = {
            id_accomodations_types,
            name_accomodations_types
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarTipoAlojamiento",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarTipoAlojamiento").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Tipo de Alojamiento actualizado con éxito.',
                });
                table =   $("#tipoAlojamientos").DataTable();
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

const EliminarTipoAlojamiento = (idTipoAlojamiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este tipo de Alojamiento?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarTipoAlojamiento",{idTipoAlojamiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Tipo de alojamiento eliminado con éxito.',
            });
            table =   $("#tipoAlojamientos").DataTable();
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

const GuardarCategoriaAlojamiento = () => {
    name_categories_types = $("#name_categories_types_new").val();
    if(name_categories_types){
        let datos = {
            name_categories_types
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaCategoriaAlojamiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaCategoriaAlojamiento").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Categoria de alojamiento creada con éxito.',
                    });
                    table =   $("#categoriasAlojamientos").DataTable();
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

const EditarCategoriaAlojamiento = (idCategoriaAlojamiento) => {
    $.post(urlBase+"ObtenerCategoriaAlojamiento",{idCategoriaAlojamiento})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_categories_types_edit").val(e.id_categories_types);
        $("#name_categories_types_edit").val(e.name_categories_types.toUpperCase());
      });
      $("#modalEditarCategoriaAlojamiento").modal('show');
    });
}

const ActualizarCategoriaAlojamiento = () => {
    id_categories_types = $("#id_categories_types_edit").val();
    name_categories_types = $("#name_categories_types_edit").val();
    if(id_categories_types && name_categories_types){
        let datos = {
            id_categories_types,
            name_categories_types
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarCategoriaAlojamiento",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarCategoriaAlojamiento").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Categoria de Alojamiento actualizada con éxito.',
                });
                table =   $("#categoriasAlojamientos").DataTable();
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

const EliminarCategoriaAlojamiento = (idCategoriaAlojamiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar esta categoria de Alojamiento?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarCategoriaAlojamiento",{idCategoriaAlojamiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Categoria de alojamiento eliminado con éxito.',
            });
            table =   $("#categoriasAlojamientos").DataTable();
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

const GuardarServicioAlojamiento = () => {
    name_amenetie = $("#name_amenetie_new").val();
    if(name_amenetie){
        let datos = {
            name_amenetie
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoServicioAlojamiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoServicioAlojamiento").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Servicio de alojamiento creada con éxito.',
                    });
                    table =   $("#serviciosAlojamientos").DataTable();
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

const EditarServicioAlojamiento = (idServicioAlojamiento) => {
    $.post(urlBase+"ObtenerServicioAlojamiento",{idServicioAlojamiento})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_amenetie_edit").val(e.id_amenetie );
        $("#name_amenetie_edit").val(e.name_amenetie.toUpperCase());
      });
      $("#modalEditarServicioAlojamiento").modal('show');
    });
}

const ActualizarServicioAlojamiento = () => {
    id_amenetie = $("#id_amenetie_edit").val();
    name_amenetie = $("#name_amenetie_edit").val();
    if(id_amenetie && name_amenetie){
        let datos = {
            id_amenetie,
            name_amenetie
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarServicioAlojamiento",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarServicioAlojamiento").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Servicio de Alojamiento actualizada con éxito.',
                });
                table =   $("#serviciosAlojamientos").DataTable();
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

const EliminarServicioAlojamiento = (idServicioAlojamiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este servicio de Alojamiento?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarServicioAlojamiento",{idServicioAlojamiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Servicio de alojamiento eliminado con éxito.',
            });
            table =   $("#serviciosAlojamientos").DataTable();
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