var urlBase="./api/museoHistorico/";

$(document).ready(function() {
    $("#fecha_nueva").val(moment().format('YYYY-MM-DD'));
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
    cargarSalidas();
    cargarInstitucionesSelect();
});


const cargarSalidas = () => {
    $('#salidas').DataTable().destroy();
    let fechaDesde = $("#fechaDesde").val();
    let fechaHasta = $("#fechaHasta").val();
    $('#salidas').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerSalidas.php?fechaDesde='+fechaDesde+'&fechaHasta='+fechaHasta
        },
        'columns': [
          { data: 'fecha_salida' },
          { data: 'idInstitucion_salida' },
          { data: 'curso_salida' },
          { data: 'cantidad_salida' },
          { data: 'acciones_salida' }
        ]
    });
}

const cargarInstitucionesSelect = () => {
    $("#institucion_nueva").empty();
    $("#institucion_edit").empty();
    $.post(urlBase+"ObtenerInstitucionesSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_institucion+"'>"+e.nombre_institucion.toUpperCase()+"</option>";
        $("#institucion_nueva").append(opcion);
        $("#institucion_edit").append(opcion);
      })
    });
}


const guardarSalida = () => {
   idInstitucion = $("#institucion_nueva").val();
   fecha = $("#fecha_nueva").val();
   curso = $("#curso_nueva").val();
   cantidad = $("#cantidad_nueva").val();
    if(idInstitucion && fecha){
        let datos = {
            idInstitucion,
            fecha,
            curso,
            cantidad
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaSalida.php",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaSalida").modal('hide');
                    $("#institucion_nueva").val('');
                    $("#fecha_nueva").val('');
                    $("#curso_nueva").val('');
                    $("#cantidad_nueva").val('');
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Salida creada con éxito.',
                    });
                    table =   $("#salidas").DataTable();
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


const editarSalida = (idSalida) => {
    $.post(urlBase+"ObtenerSalida.php",{idSalida})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#idSalida_edit").val(e.id_salida);
        $("#institucion_edit").val(e.idInstitucion_salida);
        $("#fecha_edit").val(e.fecha_salida);
        $("#curso_edit").val(e.curso_salida);
        $("#cantidad_edit").val(e.cantidad_salida);
      });
      $("#modalEditarSalida").modal('show');
    });
}

const actualizarSalida = () => {
    idSalida = $("#idSalida_edit").val();
    idInstitucion = $("#institucion_edit").val();
    fecha = $("#fecha_edit").val();
    curso = $("#curso_edit").val();
    cantidad = $("#cantidad_edit").val();
    if(idSalida && idInstitucion && fecha){
        let datos = {
            idSalida,
            idInstitucion,
            fecha,
            curso,
            cantidad
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarSalida.php",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarSalida").modal('hide');
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Salida actualizada con éxito.',
                });
                table =   $("#salidas").DataTable();
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

const eliminarSalida = (idSalida) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar esta salida?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarSalida.php",{idSalida})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Salida eliminada con éxito.',
            });
            table =   $("#salidas").DataTable();
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