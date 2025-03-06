var urlBase="./api/atractivos/";

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
    cargarAtractivos();
    cargarAtractivosSelect(); //Filtrado 
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


const cargarAtractivos = () => {
    $('#atractivos').DataTable().destroy();    
    dia = $("#dia_tourist_atraction_filter").val();
    actividad = $("#nombre_tourist_atraction_filter").find('option:selected').text();
    $('#atractivos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerAtractivos?dia='+dia+'&actividad='+actividad
        },
        'columns': [
          { data: 'name_tourist_atraction' },
          { data: 'dia_tourist_atraction' },
          { data: 'horario_tourist_atraction' },
          { data: 'address_tourist_atraction' },
          { data: 'contacto_tourist_atraction' },
          { data: 'details_tourist_atraction' },
          { data: 'acciones_tourist_atraction' },
        ]
    });
}

const cargarAtractivosSelect = () => {
    $.post(urlBase+"ObtenerAtractivosSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_tourist_atraction +"'>"+e.name_tourist_atraction.toUpperCase()+"</option>";
        $("#nombre_tourist_atraction_filter").append(opcion);
      })
    });
}


const guardarAtractivo = () => {
    nombre = $("#nombre_tourist_atraction_new").val();
    horario = $("#horario_tourist_atraction_new").val();
    contacto = $("#contacto_tourist_atraction_new").val();
    direccion = $("#direccion_tourist_atraction_new").val();
    detalles = $("#detalles_tourist_atraction_new").val();
    dia = $("#dia_tourist_atraction_new").val();
    if(nombre && horario && dia && direccion){
        let datos = {
            nombre,
            horario,
            contacto,
            direccion,
            detalles,
            dia : JSON.stringify(dia)
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoAtractivo",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoAtractivo").modal('hide');
                    $("#nombre_tourist_atraction_new").val('');
                    $("#horario_tourist_atraction_new").val('');
                    $("#contacto_tourist_atraction_new").val('');
                    $("#direccion_tourist_atraction_new").val('');
                    $("#detalles_tourist_atraction_new").val('');
                    $("#dia_tourist_atraction_new").val('');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Atractivo creado con éxito.',
                    });
                    table =   $("#atractivos").DataTable();
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

const EditarAtractivo = (idAtractivo) => {
    $.post(urlBase+"ObtenerAtractivo",{idAtractivo})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#nombre_tourist_atraction_edit").val(e.name_tourist_atraction);
        $("#horario_tourist_atraction_edit").val(e.horario_tourist_atraction);
        $("#contacto_tourist_atraction_edit").val(e.contacto_tourist_atraction);
        $("#direccion_tourist_atraction_edit").val(e.address_tourist_atraction);
        $("#detalles_tourist_atraction_edit").val(e.details_tourist_atraction);
        $("#dia_tourist_atraction_edit").val(JSON.parse(e.dia_tourist_atraction));
        $("#idEdit_atractivo").val(e.id_tourist_atraction);
      });
      $("#modalEditarAtractivo").modal('show');
    });
}

const actualizarAtractivo = () => {
    id_tourist_atraction  = $("#idEdit_atractivo").val();
    nombre = $("#nombre_tourist_atraction_edit").val();
    horario = $("#horario_tourist_atraction_edit").val();
    contacto = $("#contacto_tourist_atraction_edit").val();
    direccion = $("#direccion_tourist_atraction_edit").val();
    detalles = $("#detalles_tourist_atraction_edit").val();
    dia = $("#dia_tourist_atraction_edit").val();
    if(nombre && horario && dia && direccion){
        let datos = {
            nombre,
            horario,
            contacto,
            direccion,
            detalles,
            dia : JSON.stringify(dia),
            id_tourist_atraction 
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"ActualizarAtractivo",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalEditarAtractivo").modal('hide');
                    $("#nombre_tourist_atraction_edit").val('');
                    $("#horario_tourist_atraction_edit").val('');
                    $("#contacto_tourist_atraction_edit").val('');
                    $("#direccion_tourist_atraction_edit").val('');
                    $("#detalles_tourist_atraction_edit").val('');
                    $("#dia_tourist_atraction_edit").val('');                   
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Atractivo actualizado con éxito.',
                    });
                    table =   $("#atractivos").DataTable();
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

const EliminarAtractivo = (idAtractivo) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este atractivo?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarAtractivo",{idAtractivo})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Encuesta eliminada con éxito.',
            });
            table =   $("#atractivos").DataTable();
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
