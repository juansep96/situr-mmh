var urlBase="./api/laguna/";
var listaPrecios;
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
    await cargarPrecios();
    await cargarProvincias();
    $("#fechaDesde").val(moment().format('YYYY-MM-DD'));
    $("#fechaHasta").val(moment().format('YYYY-MM-DD'));
    await obtenerIngresos();
    await CargarPaisesSelect();

}

const CargarPaisesSelect = async () => {
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

const cargarPrecios = async () => {
    $('#precios').DataTable().destroy();
    $('#precios').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerPrecios'
        },
        'columns': [
          { data: 'nombrePrecio_price' },
          { data: 'precioResidente_price' },
          { data: 'precioTurista_price' },
          { data: 'acciones_price' },
        ]
    });
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
        dropdownParent: $('#modalNuevoIngreso .modal-body'),
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
            dropdownParent: $('#modalNuevoIngreso .modal-body'),
        });
        });
    }
}


const nuevoPrecio = async () => {
    let nombrePrecio = $("#nombre_precio").val();
    let valorTurista = $("#valorTurista").val();
    let valorResidente = $("#valorResidente").val();
    if(nombrePrecio && valorTurista && valorResidente){
        nombrePrecio = nombrePrecio.toUpperCase();
        valorTurista = parseFloat(valorTurista).toFixed(2);
        valorResidente = parseFloat(valorResidente).toFixed(2);
        let data = {
            nombrePrecio,
            valorTurista,
            valorResidente
        };
        data = JSON.stringify(data);
        $.post(urlBase+"NuevoPrecio",{data})
        .then((data)=> {
            if(data == "OK"){
                $("#modalNuevoPrecio").modal('hide');
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Precio creado con éxito.',
                });
                table =   $("#precios").DataTable();
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

const editarPrecio = async (idPrecio) => {
    $.post(urlBase+"ObtenerPrecio",{idPrecio})
    .then((data)=> {
        data = JSON.parse(data);
        data.forEach((e)=> {
            $("#idPrecio_edit").val(e.id_price);
            $("#nombre_precio_edit").val(e.nombrePrecio_price);
            $("#valorTurista_edit").val(e.precioTurista_price);
            $("#valorResidente_edit").val(e.precioResidente_price);
            $("#modalEditarPrecio").modal('show');
        })
    })
}

const actualizarPrecio = async () => {
    let idPrecio = $("#idPrecio_edit").val();
    let nombrePrecio = $("#nombre_precio_edit").val();
    let valorTurista = $("#valorTurista_edit").val();
    let valorResidente = $("#valorResidente_edit").val();
    if(nombrePrecio && valorTurista && valorResidente){
        nombrePrecio = nombrePrecio.toUpperCase();
        valorTurista = parseFloat(valorTurista).toFixed(2);
        valorResidente = parseFloat(valorResidente).toFixed(2);
        let data = {
            nombrePrecio,
            valorTurista,
            valorResidente,
            idPrecio
        };
        data = JSON.stringify(data);
        $.post(urlBase+"ActualizarPrecio",{data})
        .then((data)=> {
            if(data == "OK"){
                $("#modalEditarPrecio").modal('hide');
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Precio modificado con éxito.',
                });
                table =   $("#precios").DataTable();
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
                    msg: 'Error al modificar precio. Contacte a Soporte.',
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


const eliminarPrecio = (idPrecio) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este precio?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarPrecio",{idPrecio})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Precio eliminado con éxito.',
            });
            table =   $("#precios").DataTable();
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

const verificarTipoTurista = async () => {
    let tipo = $("#tipoTurista").val();
    if(tipo =="RESIDENTE"){
        $(".turista").prop('hidden',true);
        $(".argentina").prop('hidden',false);
        //await cargarProvincias();
        $("#provincia").val(1);
        $('#provincia').select2();
        //await cargarCiudadesSelect();
        $("#ciudad").val(96)
        $('#ciudad').select2();

    }else{
        $(".turista").prop('hidden',false);
        cargarProvincias();
    }
    verificarPaisOrigen();
    cargarPreciosNuevo(tipo);
}

const verificarPaisOrigen = async () => {
    let origen = $("#paisOrigen").val();
    if(origen !="ARGENTINA"){
        $(".argentina").prop('hidden',true);
    }else{
        $(".argentina").prop('hidden',false);
    }
}

const cargarPreciosNuevo = async (tipo) => {
    $.post(urlBase+"ObtenerPreciosNuevo.php",{tipo})
    .then((data)=> {
        $(".filaPrecios").remove();
        data = JSON.parse(data);
        listaPrecios = data;
        html = "<tr class='filaPrecios'>";
        data.forEach((e)=> {
            html = html + "<td> $ "+parseFloat(e.precio).toFixed(2)+"</td>";
        })
        html = html + "</tr>";
        $("#tablaTarifas_nueva").prepend(html);
    })
    $("#totalizador").html("$ 0.00");
}

var itemsNuevo = [];

const calcularTotal = async () => {
    vehiculos = $("#vehiculos_nuevo").val();
    !vehiculos ? vehiculos = 0 : '';
    embarcaciones = $("#embarcaciones_nuevo").val();
    !embarcaciones ? embarcaciones = 0 : '';
    canas = $("#canas_nuevo").val();
    !canas ? canas = 0 : '';
    deportes = $("#deportes_nuevo").val();
    !deportes ? deportes = 0 : '';
    deportesMotor = $("#deportesMotor_nuevo").val();
    !deportesMotor ? deportesMotor = 0 : '';
    guia = $("#guiaPesca_nuevo").val();
    !guia ? guia = 0 : '';
    totalGeneral = 0;
    itemsNuevo = [];
    listaPrecios.forEach((a)=> {
        switch(a.nombre){
            case "VEHICULO":
                total = parseFloat(a.precio) * parseInt(vehiculos);
                data =  {
                    nombre : a.nombre.toUpperCase(),
                    cantidad : vehiculos,
                    total : parseFloat(total).toFixed(2)
                };
                itemsNuevo.push(data);
                totalGeneral = totalGeneral + parseFloat(total);
            break;
            case "CAÑAS":
                total = parseFloat(a.precio) * parseInt(canas);
                data =  {
                    nombre : a.nombre.toUpperCase(),
                    cantidad : canas,
                    total : parseFloat(total).toFixed(2)
                };
                itemsNuevo.push(data);
                totalGeneral = totalGeneral + parseFloat(total);
            break;
            case "EMBARCACIONES":
                total = parseFloat(a.precio) * parseInt(embarcaciones);
                data =  {
                    nombre : a.nombre.toUpperCase(),
                    cantidad : embarcaciones,
                    total : parseFloat(total).toFixed(2)
                };
                itemsNuevo.push(data);
                totalGeneral = totalGeneral + parseFloat(total);
            break;
            case "DEPORTIVAS":
                total = parseFloat(a.precio) * parseInt(deportes);
                data =  {
                    nombre : a.nombre.toUpperCase(),
                    cantidad : deportes,
                    total : parseFloat(total).toFixed(2)
                };
                itemsNuevo.push(data);
                totalGeneral = totalGeneral + parseFloat(total);
            break;
            case "DEPORTIVAS CON MOTOR":
                total = parseFloat(a.precio) * parseInt(deportesMotor);
                data =  {
                    nombre : a.nombre.toUpperCase(),
                    cantidad : deportesMotor,
                    total : parseFloat(total).toFixed(2)
                };
                itemsNuevo.push(data);
                totalGeneral = totalGeneral + parseFloat(total);
            break;
            case "GUIA":
                total = parseFloat(a.precio) * parseInt(guia);
                data =  {
                    nombre : a.nombre.toUpperCase(),
                    cantidad : guia,
                    total : parseFloat(total).toFixed(2)
                };
                itemsNuevo.push(data);
                totalGeneral = totalGeneral + parseFloat(total);
            break;
        }
    })
    $("#totalizador").html('$ '+parseFloat(totalGeneral).toFixed(2));
}

const cargarIngreso = async () => {
    tipoTurista = $("#tipoTurista").val();
    paisOrigen = $("#paisOrigen").val();
    idCiudad = $("#ciudad").val();
    vehiculos = $("#vehiculos_nuevo").val();
    !vehiculos ? vehiculos = 0 : '';
    embarcaciones = $("#embarcaciones_nuevo").val();
    !embarcaciones ? embarcaciones = 0 : '';
    canas = $("#canas_nuevo").val();
    !canas ? canas = 0 : '';
    deportes = $("#deportes_nuevo").val();
    !deportes ? deportes = 0 : '';
    deportesMotor = $("#deportesMotor_nuevo").val();
    !deportesMotor ? deportesMotor = 0 : '';
    guia = $("#guiaPesca_nuevo").val();
    !guia ? guia = 0 : '';
    total = $("#totalizador").html();
    total = total.replace('$ ','');
    items = JSON.stringify(itemsNuevo);
    formaPago = $("#metodoPago").val();
    data = {
        tipoTurista,
        paisOrigen,
        idCiudad,
        vehiculos,
        embarcaciones,
        canas,
        deportes,
        deportesMotor,
        guia,
        total,
        items,
        formaPago
    };
    data = JSON.stringify(data);
    $.post(urlBase+"InsertarIngresoLaguna.php",{data})
    .then((data)=>{
        if(data == "OK"){
            Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Ingreso registrado con éxito.',
            })
            obtenerIngresos();
            $("#modalNuevoIngreso").modal('hide');
            items = [];
            $("#totalizador").html('$ 0.00');
            $("#vehiculos_nuevo").val('');
            $("#embarcaciones_nuevo").val('');
            $("#canas_nuevo").val('');
            $("#deportes_nuevo").val('');
            $("#deportesMotor_nuevo").val('');
            $("#guiaPesca_nuevo").val('');
        }else{
            Lobibox.notify('warning', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-message-error',
                msg: 'ERROR. Consulte a Soporte Técnico.',
              });
        }
    })
}

const obtenerIngresos = async () => {
    fechaDesde = $("#fechaDesde").val();
    fechaHasta = $("#fechaHasta").val();
    $('#ingresos').DataTable().destroy();
    $('#ingresos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerIngresos.php?desde='+fechaDesde+'&hasta='+fechaHasta
        },
        'columns': [
          { data: 'fechaHora_income' },
          { data: 'argentino_income' },
          { data: 'pais_income' },
          { data: 'name_province' },
          { data: 'idCiudad_income' },
        { data: 'vehiculos_income' },
          { data: 'canas_income' },
          { data: 'embarcaciones_income' },
          { data: 'deporte_income' },
          { data: 'deporteMotor_income' },
          { data: 'guiaPesca_income' },
          { data: 'formaPago_income' },
          { data: 'total_income' },
          { data: 'acciones_income' },

        ]
    });
}


const eliminarIngreso = (idIngreso) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este ingreso?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarIngreso.php",{idIngreso})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Ingreso eliminado con éxito.',
            });
            table =   $("#ingresos").DataTable();
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
