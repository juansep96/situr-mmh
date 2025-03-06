var urlBase="./api/configuraciones/instituciones/";

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
    cargarInstituciones();
});


const cargarInstituciones = () => {
    $('#instituciones').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerInstituciones.php'
        },
        'columns': [
          { data: 'nombre_institucion' },
          { data: 'direccion_institucion' },
          { data: 'telefono_institucion' },
          { data: 'acciones_institucion' },

        ]
    });
}


const guardarInstitucion = () => {
    nombre = $("#nombre_nuevo").val();
    direccion = $("#direccion_nuevo").val();
    telefono = $("#telefono_nuevo").val();
    if(nombre){
        let datos = {
            nombre : nombre.toUpperCase(),
            direccion,
            telefono
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaInstitucion.php",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaInstitucion").modal('hide');
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Institucion creada con éxito.',
                    });
                    $("#nombre_nuevo").val('');
                    $("#direccion_nuevo").val('');
                    $("#telefono_nuevo").val('');
                    table =   $("#instituciones").DataTable();
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

const editarInstitucion = (idInstitucion) => {
    $.post(urlBase+"ObtenerInstitucion.php",{idInstitucion})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#idInstitucion_edit").val(e.id_institucion);
        $("#nombre_edit").val(e.nombre_institucion.toUpperCase());
        $("#direccion_edit").val(e.direccion_institucion);
        $("#telefono_edit").val(e.telefono_institucion);

      });
      $("#modalEditarInstitucion").modal('show');
    });
}

const actualizarInstitucion = () => {
    idInstitucion = $("#idInstitucion_edit").val();
    nombre = $("#nombre_edit").val();
    direccion = $("#direccion_edit").val();
    telefono = $("#telefono_edit").val();
    if(idInstitucion && nombre){
        let datos = {
            idInstitucion,
            nombre,
            direccion,
            telefono
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarInstitucion",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarInstitucion").modal('hide');
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Institucion actualizado con éxito.',
                });
                table =   $("#instituciones").DataTable();
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

const eliminarInstitucion = (idInstitucion) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar esta institución?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarInstitucion.php",{idInstitucion})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Institución eliminada con éxito.',
            });
            table =   $("#instituciones").DataTable();
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
