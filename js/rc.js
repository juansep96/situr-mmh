var urlBase="./api/laguna/";
const inicializar = async () => {
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
    await cargarProvincias();
    $("#fechaDesde").val(moment().format('YYYY-MM-DD'));
    $("#fechaHasta").val(moment().format('YYYY-MM-DD'));
    await obtenerRC();
}


const cargarProvincias = async () => {
    $("#provincia").empty();
    $.post("./api/atencionesTuristicas/ObtenerProvinciasSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_province+"'>"+e.name_province.toUpperCase()+"</option>";
        $("#provincia").append(opcion);
       
      })
      $('#provincia').select2({
        dropdownParent: $('#modalNuevaRC .modal-body'),
    });
      cargarCiudadesSelect();
    });
}

const cargarCiudadesSelect = async () => {
    idProvincia = $("#provincia").val();
    if(idProvincia){
        $("#ciudad").empty();
        $.post("./api/atencionesTuristicas/ObtenerCiudadesSelect",{idProvincia})
        .then((data)=>{
          data=JSON.parse(data);
          data.forEach((e)=>{
              var opcion = "<option value='"+e.id_city+"'>"+e.name_city.toUpperCase()+"</option>";
            $("#ciudad").append(opcion);    
           
          })
          $('#ciudad').select2({
            dropdownParent: $('#modalNuevaRC .modal-body'),
        });
        });
    }
}

const nuevaRC = async () => {
    idCiudad = $("#ciudad").val();
    horaIngreso = $("#ingreso_nuevo").val();
    horaSalida = $("#salida_nuevo").val();
    apellido = $("#apellido_nuevo").val();
    nombre = $("#nombre_nuevo").val();
    dni = $("#dni_nuevo").val();
    domicilio = $("#domicilio_nuevo").val();
    telefono = $("#telefono_nuevo").val();
    email = $("#email_nuevo").val();
    matricula = $("#matricula_nuevo").val();
    caracteristicas = $("#caracteristicas_nuevo").val();
    acompanantes = $("#acompanantes_nuevo").val();
    patenteVehiculo = $("#patenteVehiculo_nuevo").val();
    nombreConductor = $("#nombreConductor_nuevo").val();
    apellidoConductor = $("#apellidoConductor_nuevo").val();
    carnet = $("#carnet_nuevo").val();
    if(horaIngreso && apellido && nombre){
        let data = {
            idCiudad,
            horaIngreso,
            horaSalida,
            apellido : apellido.toUpperCase(),
            nombre : nombre.toUpperCase(),
            dni,
            domicilio,
            telefono,
            email,
            matricula,
            caracteristicas,
            acompanantes,
            patenteVehiculo,
            nombreConductor,
            apellidoConductor,
            carnet            
        };
        data = JSON.stringify(data);
        $.post(urlBase+"NuevaRC.php",{data})
        .then((data)=> {
            if(data == "OK"){
                $("#modalNuevaRC").modal('hide');
                $("#ciudad").val('');
                $("#ingreso_nuevo").val('');
                $("#salida_nuevo").val('');
                $("#apellido_nuevo").val('');
                $("#nombre_nuevo").val('');
                $("#dni_nuevo").val('');
                $("#domicilio_nuevo").val('');
                $("#telefono_nuevo").val('');
                $("#email_nuevo").val('');
                $("#matricula_nuevo").val('');
                $("#caracteristicas_nuevo").val('');
                $("#acompanantes_nuevo").val('');
                $("#patenteVehiculo_nuevo").val('');
                $("#nombreConductor_nuevo").val('');
                $("#apellidoConductor_nuevo").val('');
                $("#carnet_nuevo").val('');
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Resp. Civil creada con éxito.',
                });
                table =   $("#rc").DataTable();
                    let info = table.page.info();
                    let page = info.page;
                    table.ajax.reload();
                    table.page( page ).draw( false );
            }else{
                Lobibox.notify('error', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-message-error',
                    msg: 'Error al guardar. Contacte a Soporte.',
                    });
            }
        })
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

const eliminarRC = (idRC) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este formulario?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarRC.php",{idRC})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Formulario eliminado con éxito.',
            });
            table =   $("#rc").DataTable();
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


const obtenerRC = async () => {
    fechaDesde = $("#fechaDesde").val();
    fechaHasta = $("#fechaHasta").val();
    $('#rc').DataTable().destroy();
    $('#rc').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerRC.php?desde='+fechaDesde+'&hasta='+fechaHasta
        },
        'columns': [
          { data: 'fecha_respCivil' },
          { data: 'horaIngreso_respCivil' },
          { data: 'horaEgreso_respCivil' },
          { data: 'nombre_respCivil' },
          { data: 'matricula_respCivil' },
          { data: 'carnet_respCivil' },
          { data: 'patenteVehiculo_respCivil' },
          { data: 'acciones_respCivil' },

        ]
    });
}


const verRC = (idRC) => {
    $.post(urlBase+"ObtenerRCIndividual.php",{idRC})
    .then((data) => {
        if(data){
            data = JSON.parse(data);
            data.forEach((e)=> {
                e.fecha_respCivil ? $("#fecha_ver").val(moment(e.fecha_respCivil).format('d/m/Y')) : $("#fecha_ver").val('');
                e.horaIngreso_respCivil ? $("#ingreso_ver").val(e.horaIngreso_respCivil) : $("#fecha_ver").val('');
                e.horaSalida_respCivil ? $("#salida_ver").val(e.horaSalida_respCivil) : $("#salida_ver").val('');
                e.apellido_respCivil ? $("#apellido_ver").val(e.apellido_respCivil.toUpperCase()) : $("#apellido_ver").val('');
                e.nombre_respCivil ? $("#nombre_ver").val(e.nombre_respCivil.toUpperCase()) : $("#nombre_ver").val('');
                e.dni_respCivil ? $("#dni_ver").val(e.dni_respCivil.toUpperCase()) : $("#dni_ver").val('');
                e.domicilio_respCivil ? $("#domicilio_ver").val(e.domicilio_respCivil.toUpperCase()) : $("#domicilio_ver").val('');
                e.name_city ? $("#ciudad_ver").val(e.name_city.toUpperCase()) : $("#ciudad_ver").val('');
                e.name_province ? $("#provincia_ver").val(e.name_province.toUpperCase()) : $("#provincia_ver").val('');
                e.telefono_respCivil ? $("#telefono_ver").val(e.telefono_respCivil.toUpperCase()) : $("#telefono_ver").val('');
                e.email_respCivil ? $("#email_ver").val(e.email_respCivil.toUpperCase()) : $("#email_ver").val('');
                e.matricula_respCivil ? $("#matricula_ver").val(e.matricula_respCivil.toUpperCase()) : $("#matricula_ver").val('');
                e.caracteristicas_respCivil ? $("#caracteristicas_ver").val(e.caracteristicas_respCivil.toUpperCase()) : $("#caracteristicas_ver").val('');
                e.apellidoConductor_respCivil ? $("#apellidoConductor_ver").val(e.apellidoConductor_respCivil.toUpperCase()) : $("#apellidoConductor_ver").val('');
                e.nombreConductor_respCivil ? $("#nombreConductor_ver").val(e.nombreConductor_respCivil.toUpperCase()) : $("#nombreConductor_ver").val('');
                e.carnet_respCivil ? $("#carnet_ver").val(e.carnet_respCivil.toUpperCase()) : $("#carnet_ver").val('');
                e.acompanantes_respCivil ? $("#acompanantes_ver").val(e.acompanantes_respCivil.toUpperCase()) : $("#acompanantes_ver").val('');
                e.patenteVehiculo_respCivil ? $("#patenteVehiculo_ver").val(e.patenteVehiculo_respCivil.toUpperCase()) : $("#patenteVehiculo_ver").val('');
            })
            $("#modalVerRC").modal('show');
        }
    })
}
