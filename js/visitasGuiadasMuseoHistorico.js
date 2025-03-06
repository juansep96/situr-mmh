var urlBase="./api/museoHistorico/";

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
    cargarVisitas();
});


const cargarVisitas = () => {
    $('#visitas').DataTable().destroy();
    $('#visitas').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerVisitas.php'
        },
        'columns': [
          { data: 'dias_visita' },
          { data: 'horarios_visita' },
          { data: 'nombre_visita' },
          { data: 'cupo_visita' },
          { data: 'acciones_visita' }
        ]
    });
}


const guardarVisita = () => {
   dias = $("#dias_nueva").val();
   horarios = $("#horarios_nueva").val();
   nombre = $("#nombre_nueva").val();
   cupo = $("#cupo_nueva").val();
    if(dias && horarios && nombre && cupo){
        let datos = {
            dias,
            horarios,
            nombre,
            cupo
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaVisita.php",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaVisita").modal('hide');
                    $("#dias_nueva").val('');
                    $("#horarios_nueva").val('');
                    $("#nombre_nueva").val('');
                    $("#cupo_nueva").val('');
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Visita creada con éxito.',
                    });
                    table =   $("#visitas").DataTable();
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


const editarVisita = (idVisita) => {
    $.post(urlBase+"ObtenerVisita.php",{idVisita})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#idVisita_edit").val(e.id_visita);
        $("#dias_edit").val(e.dias_visita);
        $("#horarios_edit").val(e.horarios_visita);
        $("#nombre_edit").val(e.nombre_visita);
        $("#cupo_edit").val(e.cupo_visita);
      });
      $("#modalEditarVisita").modal('show');
    });
}

const actualizarVisita = () => {
    idVisita = $("#idVisita_edit").val();
    dias = $("#dias_edit").val();
    horarios = $("#horarios_edit").val();
    nombre = $("#nombre_edit").val();
    cupo = $("#cupo_edit").val();
    if(idVisita && dias && horarios){
        let datos = {
            idVisita,
            dias,
            horarios,
            nombre,
            cupo
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarVisita.php",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarVisita").modal('hide');
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Visita actualizada con éxito.',
                });
                table =   $("#visitas").DataTable();
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

const eliminarVisita = (idVisita) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar esta visita guiada?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarVisita.php",{idVisita})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Visita eliminada con éxito.',
            });
            table =   $("#visitas").DataTable();
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