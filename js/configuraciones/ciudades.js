var urlBase="./api/configuraciones/ciudades/";

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
    CargarProvinciasSelect();
    CargarCiudades();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarProvinciasSelect = () => {
    $("#id_province_new").empty();
    $("#id_province_edit").empty();
    $.post(urlBase+"ObtenerProvinciasSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_province+"'>"+e.name_province.toUpperCase()+"</option>";
        $("#id_province_new").append(opcion);
        $("#id_province_edit").append(opcion);
      })
    });
}  

const CargarCiudades = () => {
    $('#ciudades').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerCiudades'
        },
        'columns': [
          { data: 'name_city' },
          { data: 'name_province' },
          { data: 'acciones_city' },
        ]
    });
}

const GuardarCiudad = () => {
    id_province_city = $("#id_province_new").val();
    name_city = $("#name_city_new").val();
    if(id_province_city && name_city){
        let datos = {
            id_province_city,
            name_city
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaCiudad",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaCiudad").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Tipo de Establecimiento creado con éxito.',
                    });
                    $("#name_city_new").val('');
                    $("#id_province_new").val('1');
                    table =   $("#ciudades").DataTable();
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

const EditarCiudad = (idCiudad) => {
    $.post(urlBase+"ObtenerCiudad",{idCiudad})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_city_edit").val(e.id_city);
        $("#name_city_edit").val(e.name_city);
        $("#id_province_edit").val(e.id_province_city.toUpperCase());
      });
      $("#modalEditarCiudad").modal('show');
    });
}

const ActualizarCiudad = () => {
    id_city  = $("#id_city_edit").val();
    id_province_city = $("#id_province_edit").val();
    name_city = $("#name_city_edit").val();
    if(id_province_city && name_city){
        let datos = {
            id_city,
            id_province_city,
            name_city
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarCiudad",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarCiudad").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Ciudad actualizada con éxito.',
                });
                table =   $("#ciudades").DataTable();
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

const EliminarCiudad = (idCiudad) => {
    Lobibox.confirm({
        msg: "Seguro que desea eliminar esta ciudad?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarCiudad",{idCiudad})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Ciudad eliminada con éxito.',
            });
            table =   $("#ciudades").DataTable();
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