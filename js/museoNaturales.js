var urlBase="./api/museoNaturales/";

$(document).ready(function() {
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
    cargarRegistros();
    CargarPaisesSelect();

});

const CargarPaisesSelect = () => {
    $("#paisOrigen").empty();
    $.post("./api/atencionesTuristicas/ObtenerPaisesSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.nombre.toUpperCase()+"'>"+e.nombre.toUpperCase()+"</option>";
        $("#paisOrigen").append(opcion);
      })
      $("#paisOrigen").val('ARGENTINA')
    });
}



const cargarRegistros = () => {
    $('#registros').DataTable().destroy();
    let fechaDesde = $("#fechaDesde").val();
    let fechaHasta = $("#fechaHasta").val();
    $('#registros').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerRegistros.php?fechaDesde='+fechaDesde+'&fechaHasta='+fechaHasta
        },
        'columns': [
            { data: 'fechaHora_registro' },
            { data: 'idUsuario_registro' },
            { data: 'primeraVez_registro' },
            { data: 'grupoFamiliar_registro' },
            { data: 'pais_registro' },
            { data: 'id_province' },
            { data: 'idCiudad_registro' },
            { data: 'comentarios_registro' },
            { data: 'acciones_registro' },
        ]
    });
}

const CargarProvinciasSelect = () => {
    $("#provincia_nuevo").empty();
    $.post("./api/atencionesTuristicas/ObtenerProvinciasSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_province+"'>"+e.name_province.toUpperCase()+"</option>";
        $("#provincia_nuevo").append(opcion);
      })
      CargarCiudadesSelect();
    });
}

const CargarCiudadesSelect = () => {
    idProvincia = $("#provincia_nuevo").val();
    if(idProvincia){
        $("#ciudad_nuevo").empty();
        $.post("./api/atencionesTuristicas/ObtenerCiudadesSelect",{idProvincia})
        .then((data)=>{
          data=JSON.parse(data);
          data.forEach((e)=>{
              var opcion = "<option value='"+e.id_city+"'>"+e.name_city.toUpperCase()+"</option>";
            $("#ciudad_nuevo").append(opcion);
          })
        });
    }
   
}

const guardarRegistro = async () => {
    idCiudad = $("#ciudad_nuevo").val();
    grupo = $("#grupo_nuevo").val();
    comentarios = $("#comentarios_nuevo").val();
    primeraVez = $("#primeraVez_nuevo").is(":checked");
    primeraVez ? primeraVez = 'SI' : primeraVez = 'NO';
    pais = $("#paisOrigen").val();

    if(idCiudad && grupo && primeraVez){
        let datos = {
            idCiudad,
            grupo,
            comentarios,
            primeraVez,
            pais
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoRegistro.php",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoRegistro").modal('hide');
                    $("#ciudad_nuevo").val("");
                    $("#grupo_nuevo").val("");
                    $("#comentarios_nuevo").val("");
                    $("#primeraVez_nuevo").val("");
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Registro creada con éxito.',
                    });
                    table =   $("#registros").DataTable();
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

const eliminarRegistro = (idRegistro) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este registro?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarRegistro.php",{idRegistro})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Registro eliminado con éxito.',
            });
            table =   $("#registros").DataTable();
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

const verificarPaisOrigen = async () => {
    let origen = $("#paisOrigen").val();
    if(origen !="ARGENTINA"){
        $(".argentina").prop('hidden',true);
    }else{
        $(".argentina").prop('hidden',false);
    }
}