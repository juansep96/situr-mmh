var urlBase="./api/cierres/";

$(document).ready(async function() {
  var fecha = moment().format("YYYY-MM-DD HH:mm");
  $("#fecha_nuevo").val(fecha);
  $("#desde").val(moment().format("YYYY-MM-DD ")+'00:00');
  $("#hasta").val(moment().format("YYYY-MM-DD ")+'23:59');
  await cargarCierres();
});


function CargarMontos(){
  $.post(urlBase+"ObtenerUltimoArqueo.php")
  .then((data)=>{
    data = JSON.parse(data);
    data = data[0];
    fechaHora = data.fechaHora_arqueo;
    user = data.last_name_user.toUpperCase() + ' ' + data.first_name_user.toUpperCase();
    message =' '+ moment(fechaHora).format('DD/MM/YYYY HH:mm') + 'HS. POR ' + user;
    $("#info").html(message);
    $.post(urlBase+"ObtenerIngresosTotales",{fechaHora})
    .then((ingresos)=>{
        ingresos=JSON.parse(ingresos);
        efectivo = 0;
        transferencia = 0;
        total = 0;
        ingresos.forEach((e)=> {
            e.medioPago_income == 'EFECTIVO' ? efectivo = efectivo + parseFloat(e.total) : transferencia = transferencia + parseFloat(e.total);
            total = total + parseFloat(e.total);
        })
        efectivo = parseFloat(efectivo).toFixed(2);
        transferencia = parseFloat(transferencia).toFixed(2);
        total = parseFloat(total).toFixed(2);
        $("#efectivo_nuevo").val(efectivo);
        $("#transferencia_nuevo").val(transferencia);
        $("#total_nuevo").val(total);
    })
  })
 
}

function GuardarArqueo(){
    fecha = $("#fecha_nuevo").val();
    total = $("#total_nuevo").val();
    efectivo = $("#efectivo_nuevo").val();
    transferencia=$("#transferencia_nuevo").val();
    obs = $("#obs_nuevo").val();
    if(fecha && total && efectivo && transferencia){
       total = parseFloat(total).toFixed(2);
       efectivo = parseFloat(efectivo).toFixed(2);
       transferencia = parseFloat(transferencia).toFixed(2);
       obs ? obs = obs.toUpperCase() : obs = '';
        datos = {
           fecha,
           total,
           efectivo,
           transferencia,
           obs
        };
       datos = JSON.stringify(datos);
        Lobibox.confirm({
            msg: "Seguro  que desea cargar este Cierre?",
            callback: function ($this, type, ev) {
              if(type=="yes"){
                $.post(urlBase+"NuevoCierre.php",{datos})
                .then((res)=>{
                    if(res=="OK"){
                        Lobibox.notify('success', {
                            pauseDelayOnHover: true,
                            continueDelayOnInactiveTab: false,
                            position: 'top right',
                            icon: 'bx bx-check-circle',
                            msg: 'Cierre Agregado!',
                          });
                        $("#modalNuevoCierre").modal('hide');
                        cargarCierres();
                        $("#obs_nuevo").val('');
                    }else{
                        Lobibox.notify('warning', {
                            pauseDelayOnHover: true,
                            continueDelayOnInactiveTab: false,
                            position: 'top right',
                            icon: 'bx bx-message-warning',
                            msg: 'Error al Crear. Contacte a Soporte Tecnico.',
                          });
                    }
                })
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


function cargarCierres(){
    fecha = $("#desde").val();
    fechaHasta=$("#hasta").val();
    $("#cierres").dataTable().fnDestroy();
    $.extend(true, $.fn.dataTable.defaults, {
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
          "sortAscending": ": Activar para ordenar la columna de manera ascendente",
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
    });
    $('#cierres').DataTable({
      responsive: false,
      'processing': true,
      'serverSide': true,
      'serverMethod': 'post',
      'searching':false,
      'ajax': {
        'url': urlBase+"ObtenerCierres.php?fecha="+fecha+"&fechaHasta="+fechaHasta,
      },
      'columns': [{
          data: 'fecha_arqueo'
        },
        {
          data: 'hora_arqueo'
        },
        {
          data: 'name_user'
        },
        {
          data: 'efectivo_arqueo'
        },
        {
          data: 'transferencia_arqueo'
        },
        {
          data: 'ingresos_arqueo'
        },
        {
          data: 'acciones_arqueo', className:'mostrarColumna'
        }
      ]
    });
    ObtenerTotalesPeriodo();
}


function EliminarArqueo(idCierre){
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este Cierre?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarCierre",{idCierre})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Cierre eliminado con Ã©xito.',
            });
            table =   $("#cierres").DataTable();
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


function ObtenerTotalesPeriodo(){
  desde=$("#desde").val();
  hasta=$("#hasta").val();
  $.post(urlBase+"ObtenerCierresPorPeriodo.php",{desde,hasta})
    .then((ingresos)=>{
      ingresos=JSON.parse(ingresos);
      efectivo = 0;
      transferencia = 0;
      total = 0;
      ingresos.forEach((e)=> {
          e.medioPago_income == 'EFECTIVO' ? efectivo = efectivo + parseFloat(e.total) : '';
          e.medioPago_income == 'TRANSFERENCIA' ? transferencia = transferencia + parseFloat(e.total) : '';

          total = total + parseFloat(e.total);
      })
      efectivo = parseFloat(efectivo).toFixed(2);
      transferencia = parseFloat(transferencia).toFixed(2);
      total = parseFloat(total).toFixed(2);
      $("#efectivo").val('$ '+efectivo);
      $("#transferencia").val('$ '+transferencia);
      $("#ingresos").val('$ '+total);
    })
}