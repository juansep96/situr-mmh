var urlBase="./api/gastronomia/";
var arrayServicios=[];
var serviciosSelectEdit;
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
    CargarEstablecimientos();
    CargarCategoriasSelect();
    CargarServiciosGastronomiaSelect();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarEstablecimientos = () => {
    $('#establecimientos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerEstablecimientos'
        },
        'columns': [
          { data: 'name_gastronomy' },
          { data: 'address_gastronomy' },
          { data: 'phone_gastronomy' },
          { data: 'name_gastronomy_type' },
          { data: 'quantity_guests_gastronomy' },
          { data: 'details_gastronomy' },
          { data: 'acciones_gastronomy' },
        ]
    });
}

const CargarServiciosGastronomiaSelect = () => {
    $.post(urlBase+"ObtenerServiciosGastronomiaSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
            item = {
                value:e.id_service,
                label:e.name_service.toUpperCase(),
                id:e.id_service
            }
            arrayServicios.push(item);
      })
        serviciosSelect = new Choices('#ids_services_gastronomy_new', {
            removeItemButton: true,
            searchResultLimit:50,
            renderChoiceLimit:50,
            choices:arrayServicios
        });
        serviciosSelectEdit = new Choices('#ids_services_gastronomy_edit', {
            removeItemButton: true,
            searchResultLimit:50,
            renderChoiceLimit:50,
            choices:arrayServicios
        });
    });     
}

const CargarCategoriasSelect = () => {
    $.post(urlBase+"ObtenerCategoriasSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
            var opcion = "<option value='"+e.id_gastronomy_type +"'>"+e.name_gastronomy_type.toUpperCase()+"</option>";
            $("#id_type_gastronomy_new").append(opcion);
            $("#id_type_gastronomy_edit").append(opcion);
      })
      
    });
}


const GuardarEstablecimiento = () => {
    name_gastronomy = $("#name_gastronomy_new").val();
    phone_gastronomy = $("#phone_gastronomy_new").val();
    address_gastronomy = $("#address_gastronomy_new").val();
    email_gastronomy = $("#email_gastronomy_new").val();
    id_type_gastronomy = $("#id_type_gastronomy_new").val();
    ids_services_gastronomy = $("#ids_services_gastronomy_new").val();
    quantity_guests_gastronomy = $("#quantity_guests_gastronomy_new").val();
    details_gastronomy = $("#details_gastronomy_new").val();
    nombreResponsable = $("#nombreResponsable_gastronomy_new").val();
    contactoPersonal = $("#contactoPersonal_gastronomy_new").val();
    razonSocial = $("#razonSocial_gastronomy_new").val();
    redes = $("#redes_gastronomy_new").val();
    horario = $("#horario_gastronomy_new").val();

    if(name_gastronomy && phone_gastronomy && address_gastronomy && id_type_gastronomy && ids_services_gastronomy){
        let datos = {
            name_gastronomy,
            phone_gastronomy,
            address_gastronomy,
            email_gastronomy,
            id_type_gastronomy,
            ids_services_gastronomy : JSON.stringify(ids_services_gastronomy),
            quantity_guests_gastronomy,
            details_gastronomy,
            nombreResponsable,
            contactoPersonal,
            razonSocial,
            redes,
            horario
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoEstablecimiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoEstablecimiento").modal('hide');
                    $("#name_gastronomy_new").val("");
                    $("#phone_gastronomy_new").val("");
                    $("#address_gastronomy_new").val("");
                    $("#email_gastronomy_new").val("");
                    $("#id_type_gastronomy_new").val("");
                    $("#quantity_guests_gastronomy_new").val("");
                    $("#details_gastronomy_new").val("");
                    $("#nombreResponsable_gastronomy_new").val('');
                    $("#contactoPersonal_gastronomy_new").val('');
                    $("#razonSocial_gastronomy_new").val('');
                    $("#redes_gastronomy_new").val('');
                    $("#horario_gastronomy_new").val('');
                    serviciosSelect.removeActiveItems();
                    serviciosSelect.destroy();
                    serviciosSelect = new Choices('#ids_services_gastronomy_new', {
                        choices:arrayServicios
                    });
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Establecimiento creado con éxito.',
                    });
                    table =   $("#establecimientos").DataTable();
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

const VerEstablecimiento = (idEstablecimiento) => {
    $(".filaServicios").remove();
    $.post(urlBase+"ObtenerEstablecimiento",{idEstablecimiento})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#name_gastronomy").val(e.name_gastronomy.toUpperCase());
        $("#phone_gastronomy").val(e.phone_gastronomy);
        $("#address_gastronomy").val(e.address_gastronomy.toUpperCase());
        !e.email_gastronomy ? e.email_gastronomy = '' : '';
        $("#email_gastronomy").val(e.email_gastronomy.toUpperCase());
        $("#quantity_guests_gastronomy").val(e.quantity_guests_gastronomy);
        !e.details_gastronomy ? e.details_gastronomy = '' : '';
        $("#details_gastronomy").val(e.details_gastronomy.toUpperCase());
        $("#nombreResponsable_gastronomy").val(e.nombreResponsable_gastronomy);
        $("#contactoPersonal_gastronomy").val(e.contactoPersonal_gastronomy);
        $("#razonSocial_gastronomy").val(e.razonSocial_gastronomy);
        $("#redes_gastronomy").val(e.redes_gastronomy);
        $("#horario_gastronomy").val(e.horario_gastronomy);
        //Servicios
         let servicios = eval(e.services_gastronomy);
         servicios.forEach((f)=> {
            htmlTags = '<tr class="filaServicios">' +
                            '<td>' + f[1].toUpperCase() + '</td>'+
                        '</tr>';
                $('#tabla-servicios tbody').append(htmlTags);
         })
      });
      $("#modalVerEstablecimiento").modal('show');
    });
}

const EditarEstablecimiento = (idEstablecimiento) => {
    serviciosSelectEdit.removeActiveItems();
    serviciosSelectEdit.destroy();
    serviciosSelectEdit = new Choices('#ids_services_gastronomy_edit', {
        choices:arrayServicios
    });
    $.post(urlBase+"ObtenerEstablecimiento",{idEstablecimiento})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_gastronomy_edit").val(e.id_gastronomy);
        $("#name_gastronomy_edit").val(e.name_gastronomy.toUpperCase());
        $("#phone_gastronomy_edit").val(e.phone_gastronomy);
        $("#address_gastronomy_edit").val(e.address_gastronomy.toUpperCase());
        !e.email_gastronomy ? e.email_gastronomy = '' : '';
        $("#email_gastronomy_edit").val(e.email_gastronomy.toUpperCase());
        $("#quantity_guests_gastronomy_edit").val(e.quantity_guests_gastronomy);
        !e.details_gastronomy ? e.details_gastronomy = '' : '';
        $("#details_gastronomy_edit").val(e.details_gastronomy.toUpperCase());
        $("#id_type_gastronomy_edit").val(e.id_type_gastronomy);
        $("#nombreResponsable_gastronomy_edit").val(e.nombreResponsable_gastronomy);
        $("#contactoPersonal_gastronomy_edit").val(e.contactoPersonal_gastronomy);
        $("#razonSocial_gastronomy_edit").val(e.razonSocial_gastronomy);
        $("#redes_gastronomy_edit").val(e.redes_gastronomy);
        $("#horario_gastronomy_edit").val(e.horario_gastronomy);
         //Servicios
         let servicios = eval(e.services_gastronomy);
         servicios.forEach((f)=> {
             serviciosSelectEdit.setChoiceByValue(f[0]);
         })
      });
      $("#modalEditarEstablecimiento").modal('show');
    });
}

const ActualizarEstablecimiento = () => {
    id_gastronomy = $("#id_gastronomy_edit").val();
    name_gastronomy = $("#name_gastronomy_edit").val();
    phone_gastronomy = $("#phone_gastronomy_edit").val();
    address_gastronomy = $("#address_gastronomy_edit").val();
    email_gastronomy = $("#email_gastronomy_edit").val();
    id_type_gastronomy = $("#id_type_gastronomy_edit").val();
    ids_services_gastronomy = $("#ids_services_gastronomy_edit").val();
    quantity_guests_gastronomy = $("#quantity_guests_gastronomy_edit").val();
    details_gastronomy = $("#details_gastronomy_edit").val();
    nombreResponsable = $("#nombreResponsable_gastronomy_edit").val();
    contactoPersonal = $("#contactoPersonal_gastronomy_edit").val();
    razonSocial = $("#razonSocial_gastronomy_edit").val();
    redes = $("#redes_gastronomy_edit").val();
    horario = $("#horario_gastronomy_edit").val();
    if(id_gastronomy && name_gastronomy && phone_gastronomy && address_gastronomy && id_type_gastronomy && ids_services_gastronomy){
        let datos = {
            id_gastronomy,
            name_gastronomy,
            phone_gastronomy,
            address_gastronomy,
            email_gastronomy,
            id_type_gastronomy,
            ids_services_gastronomy : JSON.stringify(ids_services_gastronomy),
            quantity_guests_gastronomy,
            details_gastronomy,
            nombreResponsable,
            contactoPersonal,
            razonSocial,
            redes,
            horario
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"ActualizarEstablecimiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalEditarEstablecimiento").modal('hide');
                    $("#name_gastronomy_edit").val("");
                    $("#phone_gastronomy_edit").val("");
                    $("#address_gastronomy_edit").val("");
                    $("#email_gastronomy_edit").val("");
                    $("#id_type_gastronomy_edit").val("");
                    $("#quantity_guests_gastronomy_edit").val("");
                    $("#details_gastronomy_edit").val("");
                    $("#nombreResponsable_gastronomy_edit").val('');
                    $("#contactoPersonal_gastronomy_edit").val('');
                    $("#razonSocial_gastronomy_edit").val('');
                    $("#redes_gastronomy_edit").val('');
                    $("#horario_gastronomy_edit").val('');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Establecimiento actualizado con éxito.',
                    });
                    table =   $("#establecimientos").DataTable();
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


const EliminarEstablecimiento = (idEstablecimiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este Establecimiento?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarEstablecimiento",{idEstablecimiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Establecimiento eliminado con éxito.',
            });
            table =   $("#establecimientos").DataTable();
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