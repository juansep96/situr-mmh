var urlBase="./api/configuraciones/transportes/";

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
    CargarTipoTransportes();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarTipoTransportes = () => {
    $('#tipoTransportes').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerTipoTransportes'
        },
        'columns': [
          { data: 'name_transportations_type' },
          { data: 'acciones_transportations_type' },
        ]
    });
}

const GuardarTipoTransporte = () => {
    name_transportations_type = $("#name_transportations_type_new").val();
    if(name_transportations_type){
        let datos = {
            name_transportations_type
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoTipoTransporte",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoTipoTransporte").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Tipo de Transporte creado con éxito.',
                    });
                    $("#name_transportations_type_new").val('');
                    table =   $("#tipoTransportes").DataTable();
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

const EditarTipoTransporte = (idTipoTransporte) => {
    $.post(urlBase+"ObtenerTipoTransporte",{idTipoTransporte})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_transportations_type_edit").val(e.id_transportations_type);
        $("#name_transportations_type_edit").val(e.name_transportations_type.toUpperCase());
      });
      $("#modalEditarTipoTransporte").modal('show');
    });
}

const ActualizarTipoTransporte = () => {
    id_transportations_type  = $("#id_transportations_type_edit").val();
    name_transportations_type = $("#name_transportations_type_edit").val();
    if(id_transportations_type && name_transportations_type){
        let datos = {
            id_transportations_type,
            name_transportations_type
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarTipoTransporte",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarTipoTransporte").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Tipo de Transporte actualizado con éxito.',
                });
                table =   $("#tipoTransportes").DataTable();
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

const EliminarTipoTransporte = (idTipoTransporte) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este tipo de Transporte",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarTipoTransporte",{idTipoTransporte})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Tipo de transporte eliminado con éxito.',
            });
            table =   $("#tipoTransportes").DataTable();
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
