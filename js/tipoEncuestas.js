var urlBase="./api/configuraciones/encuestas/";

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
                "last": "Ãšltimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "processing": "Procesando...",
            "search": "Buscar:",
            "searchPlaceholder": "",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "NingÃºn dato disponible en esta tabla",
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
                "collection": "ColecciÃ³n",
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
    cargarTipoEncuestas();
});


const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const cargarTipoEncuestas = () => {
    $('#motivos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerMotivos'
        },
        'columns': [
          { data: 'nombre_motivo' },
          { data: 'acciones_motivo' },
        ]
    });
}

const guardarMotivo = () => {
    nombre_motivo = $("#nombre_motivo_new").val();
    if(nombre_motivo){
        let datos = {
            nombre_motivo
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoMotivo",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalMuevoMotivo").modal('hide');
                    $("#nombre_motivo_new").val('');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Motivo creado con Ã©xito.',
                    });
                    table =   $("#motivos").DataTable();
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

const EditarMotivo = (idMotivo) => {
    $.post(urlBase+"ObtenerMotivo",{idMotivo})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_motivo_edit").val(e.id_motivo);
        $("#nombre_motivo_edit").val(e.nombre_motivo.toUpperCase());
      });
      $("#modalEditarMotivo").modal('show');
    });
}

const actualizarMotivo = () => {
    id_motivo = $("#id_motivo_edit").val();
    nombre_motivo = $("#nombre_motivo_edit").val();
    if(id_motivo && nombre_motivo){
        let datos = {
            id_motivo,
            nombre_motivo
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarMotivo",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarMotivo").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Tipo de motivo actualizado con Ã©xito.',
                });
                table =   $("#motivos").DataTable();
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

const EliminarMotivo = (idMotivo) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este tipo de Alojamiento?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarMotivo",{idMotivo})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Motivo eliminado con Ã©xito.',
            });
            table =   $("#motivos").DataTable();
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
              msg: 'AcciÃ³n cancelada.',
            });
          }
      }
      });
}