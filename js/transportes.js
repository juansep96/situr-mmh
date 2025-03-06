var urlBase="./api/transportes/";
var arrayDestinos = [];
$(document).ready(function() {    
    $.extend( true, $.fn.dataTable.defaults, {
        "language": {
            "decimal": ",",
            "thousands": ".",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "MoarrayServiciosstrando registros del 0 al 0 de un total de 0 registros",
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
    CargarTransportes();
    CargarTipoTransportesSelect();
    CargarDestinosSelect();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarTransportes = () => {
    $('#transportes').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerTransportes'
        },
        'columns': [
          { data: 'name_transportation' },
          { data: 'address_transportation' },
          { data: 'phone_transportation' },
          { data: 'horarioAtencion_transportation' }, 
          { data: 'name_transportations_type' },
          { data: 'ids_destines_transportation' },
          { data: 'acciones_transportation' },
        ]
    });
}

const CargarTipoTransportesSelect = () => {
    $("#type_transportation_new").empty();
    $.post(urlBase+"ObtenerTiposTransporteSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_transportations_type+"'>"+e.name_transportations_type.toUpperCase()+"</option>";
        $("#type_transportation_new").append(opcion);
        $("#type_transportation_edit").append(opcion);

      })
    });
}

const CargarDestinosSelect = () => {
    $.post(urlBase+"ObtenerDestinosSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
            item = {
                value:e.id_city,
                label:e.name_city.toUpperCase(),
                id:e.id_city
            }
            arrayDestinos.push(item);
      })
        destinosSelect = new Choices('#ids_destines_new', {
            removeItemButton: true,
            searchResultLimit:20,
            renderChoiceLimit:20,
            choices:arrayDestinos
        });
        destinosSelectEdit = new Choices('#ids_destines_edit', {
            removeItemButton: true,
            searchResultLimit:20,
            renderChoiceLimit:20,
            choices:arrayDestinos
        });
    });     
}

const GuardarTransporte = () => {
    name_transportation = $("#name_transportation_new").val();
    phone_transportation = $("#phone_transportation_new").val();
    address_transportation = $("#address_transportation_new").val();
    horarioAtencion_transportation = $("#horarioAtencion_transportation_new").val();
    tarif_transportation = $("#tarif_transportation_new").val();
    horarios_transportation = $("#horarios_transportation_new").val();
    redes_transportation = $("#redes_transportation_new").val();
    ids_destines_transportation = $("#ids_destines_new").val();
    id_type_transportation =$("#type_transportation_new").val();
    details_transportation = $("#details_transportation_new").val();
    if(name_transportation && phone_transportation && address_transportation && ids_destines_transportation && id_type_transportation){
        let datos = {
            name_transportation,
            phone_transportation,
            address_transportation,
            ids_destines_transportation : JSON.stringify(ids_destines_transportation),
            id_type_transportation,
            details_transportation,
            horarioAtencion_transportation,
            tarif_transportation,
            horarios_transportation,
            redes_transportation
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoTransporte",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoTransporte").modal('hide');
                    $("#name_transportation_new").val("");
                    $("#phone_transportation_new").val("");
                    $("#address_transportation_new").val("");
                    $("#email_transportation_new").val("");
                    $("#ids_destines_new").val("");
                    $("#type_transportation_new").val("");
                    $("#details_transportation_new").val("");
                    $("#horarioAtencion_transportation_new").val('');
                    $("#tarif_transportation_new").val('');
                    $("#horarios_transportation_new").val('');
                    $("#redes_transportation_new").val('');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Transporte creado con éxito.',
                    });
                    table =   $("#transportes").DataTable();
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

const VerTransporte = (idTransporte) => {
    $.post(urlBase+"ObtenerTransporte",{idTransporte})
    .then((data) => {
        if(data){
            data = JSON.parse(data);
            data.forEach((e) => {
                $("#name_transportation").val(e.name_transportation);
                $("#phone_transportation").val(e.phone_transportation);
                !e.address_transportation ? e.address_transportation = '' : '';
                $("#address_transportation").val(e.address_transportation);
                $("#type_transportation").val(e.name_transportations_type);
                !e.details_transportation ? e.details_transportation = '' : '';
                $("#details_transportation").val(e.details_transportation);
                $("#destines_transportation").val(e.destinos);
                $("#horarioAtencion_transportation").val(e.horarioAtencion_transportation);
                $("#tarif_transportation").val(e.tarif_transportation);
                $("#horarios_transportation").val(e.horarios_transportation);
                $("#redes_transportation").val(e.redes_transportation);
            })
            $("#modalVerTransporte").modal('show');
        }
    })
}

const EditarTransporte = (idTransporte) => {
    $.post(urlBase+"ObtenerTransporte",{idTransporte})
    .then((data) => {
        if(data){
            data = JSON.parse(data);
            data.forEach((e) => {
                $("#id_transportation_edit").val(e.id_transportation);
                $("#name_transportation_edit").val(e.name_transportation.toUpperCase());
                $("#phone_transportation_edit").val(e.phone_transportation.toUpperCase());
                !e.address_transportation ? e.address_transportation = '' : '';
                $("#address_transportation_edit").val(e.address_transportation.toUpperCase());
                !e.details_transportation ? e.details_transportation = '' : '';
                $("#details_transportation_edit").val(e.details_transportation.toUpperCase());
                let destinos = e.destinos.split(' - ');
                destinos.forEach((f)=> {
                    const searchIndex = arrayDestinos.findIndex((destino) => destino.label.toUpperCase()==f.toUpperCase());
                    destinosSelectEdit.setChoiceByValue(arrayDestinos[searchIndex].id);            
                })
                $("#type_transportation_edit").val(e.id_transportations_type);
                $("#horarioAtencion_transportation_edit").val(e.horarioAtencion_transportation);
                $("#tarif_transportation_edit").val(e.tarif_transportation);
                $("#horarios_transportation_edit").val(e.horarios_transportation);
                $("#redes_transportation_edit").val(e.redes_transportation);
            })
            $("#modalEditarTransporte").modal('show');
        }
    })
}

const ActualizarTransporte = () => {
    id_transportation = $("#id_transportation_edit").val();
    name_transportation = $("#name_transportation_edit").val();
    phone_transportation = $("#phone_transportation_edit").val();
    address_transportation = $("#address_transportation_edit").val();
    ids_destines_transportation = $("#ids_destines_edit").val();
    id_type_transportation =$("#type_transportation_edit").val();
    details_transportation = $("#details_transportation_edit").val();
    horarioAtencion_transportation = $("#horarioAtencion_transportation_edit").val();
    tarif_transportation = $("#tarif_transportation_edit").val();
    horarios_transportation = $("#horarios_transportation_edit").val();
    redes_transportation = $("#redes_transportation_edit").val();
    if(id_transportation && name_transportation && phone_transportation && address_transportation && ids_destines_transportation && id_type_transportation){
        let datos = {
            id_transportation,
            name_transportation,
            phone_transportation,
            address_transportation,
            ids_destines_transportation : JSON.stringify(ids_destines_transportation),
            id_type_transportation,
            details_transportation,
            horarioAtencion_transportation,
            tarif_transportation,
            horarios_transportation,
            redes_transportation
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"ActualizarTransporte",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalEditarTransporte").modal('hide');
                    $("#name_transportation_edit").val("");
                    $("#phone_transportation_edit").val("");
                    $("#address_transportation_edit").val("");
                    $("#ids_destines_edit").val("");
                    $("#type_transportation_edit").val("");
                    $("#details_transportation_edit").val("");
                    $("#horarioAtencion_transportation_edit").val('');
                    $("#tarif_transportation_edit").val('');
                    $("#horarios_transportation_edit").val('');
                    $("#redes_transportation_edit").val('');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Transporte actualizado con éxito.',
                    });
                    table =   $("#transportes").DataTable();
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

const EliminarTransporte = (idTransporte) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este transporte?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarTransporte",{idTransporte})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Transporte eliminado con éxito.',
            });
            table =   $("#transportes").DataTable();
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

