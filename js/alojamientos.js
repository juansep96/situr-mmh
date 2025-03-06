var urlBase="./api/alojamientos/";
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
    CargarAlojamientos();
    CargarTiposAlojamientoSelect();
    CargarCategoriasAlojamientosSelect();
    CargarServiciosAlojamientosSelect();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarAlojamientos = () => {
    $('#alojamientos').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerAlojamientos'
        },
        'columns': [
          { data: 'name_accomodation' },
          { data: 'address_accomodation' },
          { data: 'phone_accomodation' },
          { data: 'name_accomodations_types' },
          { data: 'acciones_accomodation' },
        ]
    });
}

const CargarTiposAlojamientoSelect = () => {
    $("#type_accomodation_new").empty();
    $.post(urlBase+"ObtenerTiposAlojamientoSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_accomodations_types+"'>"+e.name_accomodations_types.toUpperCase()+"</option>";
        $("#type_accomodation_new").append(opcion);
        $("#type_accomodation_edit").append(opcion);
        $("#type_accomodation_filter").append(opcion);

      })
    });
}

const CargarCategoriasAlojamientosSelect = () => {
    $.post(urlBase+"ObtenerCategoriasAlojamientosSelect")
    .then((data)=>{
      data=JSON.parse(data);
      var opcion2 = "<option value=''>NINGUNA</option>";
      $("#category_accomodation_new").append(opcion2);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_categories_types +"'>"+e.name_categories_types.toUpperCase()+"</option>";
        $("#category_accomodation_new").append(opcion);
        $("#category_accomodation_edit").append(opcion);
      })
      
    });
}

const CargarServiciosAlojamientosSelect = () => {
    $.post(urlBase+"ObtenerServiciosAlojamientosSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
            item = {
                value:e.id_amenetie,
                label:e.name_amenetie.toUpperCase(),
                id:e.id_amenetie
            }
            arrayServicios.push(item);
      })
      serviciosSelect = new Choices('#ids_ameneties_new', {
        removeItemButton: true,
        searchResultLimit:50,
        renderChoiceLimit:50,
        choices:arrayServicios
    });
    serviciosSelectEdit = new Choices('#ids_ameneties_edit', {
        removeItemButton: true,
        searchResultLimit:50,
        renderChoiceLimit:50,
        choices:arrayServicios
    });
    serviciosSelectFilter = new Choices('#ids_ameneties_filter', {
        removeItemButton: true,
        searchResultLimit:50,
        renderChoiceLimit:50,
        choices:arrayServicios
    });
    });  
    
}

const GuardarAlojamiento = () => {
    name_accomodation = $("#name_accomodation_new").val();
    phone_accomodation = $("#phone_accomodation_new").val();
    address_accomodation = $("#address_accomodation_new").val();
    email_accomodation = $("#email_accomodation_new").val();
    id_type_accomodation = $("#type_accomodation_new").val();
    id_type_category_accomodation = $("#category_accomodation_new").val();
    ids_amenities_accomodation = $("#ids_ameneties_new").val();
    
    details_accomodation = $("#details_accomodation_new").val();
    nombreResponsable = $("#nombreResponsable_accomodation_new").val();
    contactoPersonal = $("#contactoPersonal_accomodation_new").val();
    razonSocial = $("#razonSocial_accomodation_new").val();
    celular = $("#celular_accomodation_new").val();
    whatsapp = $("#whatsapp_accomodation_new").val();
    website = $("#website_accomodation_new").val();
    redes = $("#redes_accomodation_new").val();

    /* EN EL CASO DE CAMPING, ASIGANAMOS PARCELAS A CAMPO X1, BUNGALOWS, CABAÑAS Y DORMIS CONSECUTIVAMENTE*/
    tipoAlojamiento = $("#type_accomodation_new").find('option:selected').text().toLowerCase();
    switch(tipoAlojamiento.toLowerCase()){
        case 'hotel':
            cant_x1 = $("#cant_x1_accomodation_new_hotel").val();
            cant_x2 = $("#cant_x2_accomodation_new_hotel").val();
            cant_x3 = $("#cant_x3_accomodation_new_hotel").val();
            cant_x4 = $("#cant_x4_accomodation_new_hotel").val();
            cant_x5 = $("#cant_x5_accomodation_new_hotel").val();
            cant_x6 = $("#cant_x6_accomodation_new_hotel").val();
            cant_x7 = $("#cant_x7_accomodation_new_hotel").val();
            cant_x8 = $("#cant_x8_accomodation_new_hotel").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_new_hotel").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_new_hotel").val();
        break;   
        case 'hostel':
            cant_x1 = $("#cant_x1_accomodation_new_hotel").val();
            cant_x2 = $("#cant_x2_accomodation_new_hotel").val();
            cant_x3 = $("#cant_x3_accomodation_new_hotel").val();
            cant_x4 = $("#cant_x4_accomodation_new_hotel").val();
            cant_x5 = $("#cant_x5_accomodation_new_hotel").val();
            cant_x6 = $("#cant_x6_accomodation_new_hotel").val();
            cant_x7 = $("#cant_x7_accomodation_new_hotel").val();
            cant_x8 = $("#cant_x8_accomodation_new_hotel").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_new_hotel").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_new_hotel").val();
        break;     
        case 'camping':
            cant_x1 = $("#cant_x1_accomodation_new_camping").val();
            cant_x2 = $("#cant_x2_accomodation_new_camping").val();
            cant_x3 = $("#cant_x3_accomodation_new_camping").val();
            cant_x4 = $("#cant_x4_accomodation_new_camping").val();
            cant_x5 = $("#cant_x5_accomodation_new_camping").val();
            cant_x6 = $("#cant_x6_accomodation_new_camping").val();
            cant_x7 = $("#cant_x7_accomodation_new_camping").val();
            cant_x8 = $("#cant_x8_accomodation_new_camping").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_new_camping").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_new_camping").val();
        break;
        case 'inmobiliaria':
            cant_x1 = $("#cant_x1_accomodation_new_inmobiliaria").val();
            cant_x2 = $("#cant_x2_accomodation_new_inmobiliaria").val();
            cant_x3 = $("#cant_x3_accomodation_new_inmobiliaria").val();
            cant_x4 = $("#cant_x4_accomodation_new_inmobiliaria").val();
            cant_x5 = $("#cant_x5_accomodation_new_inmobiliaria").val();
            cant_x6 = $("#cant_x6_accomodation_new_inmobiliaria").val();
            cant_x7 = $("#cant_x7_accomodation_new_inmobiliaria").val();
            cant_x8 = $("#cant_x8_accomodation_new_inmobiliaria").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_new_inmobiliaria").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_new_inmobiliaria").val();
        break;
    }
    capacitaPersonal = $("#capacitaPersonal_accomodation_new").val();

    if(name_accomodation && phone_accomodation && address_accomodation && id_type_accomodation && quantity_guest_accomodation && quantity_rooms_accomodation){
        let datos = {
            name_accomodation,
            phone_accomodation,
            address_accomodation,
            email_accomodation,
            id_type_accomodation,
            id_type_category_accomodation,
            ids_amenities_accomodation : JSON.stringify(ids_amenities_accomodation),
            quantity_guest_accomodation,
            quantity_rooms_accomodation,
            details_accomodation,
            nombreResponsable,
            contactoPersonal,
            razonSocial,
            celular,
            whatsapp,
            website,
            cant_x1,
            cant_x2,
            cant_x3,
            cant_x4,
            cant_x5,
            cant_x6,
            cant_x7,
            cant_x8,
            capacitaPersonal,
            redes
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoAlojamiento",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoAlojamiento").modal('hide');
                    $("#name_accomodation_new").val('');
                    $("#phone_accomodation_new").val('');
                    $("#address_accomodation_new").val('');
                    $("#email_accomodation_new").val('');
                    $("#type_accomodation_new").val(1);
                    $("#category_accomodation_new").val('');
                    $("#ids_ameneties_new").val('');
                    $("#quantity_guest_accomodation_new").val('1');
                    $("#quantity_rooms_accomodation_new").val('1');
                    $("#details_accomodation_new").val('');
                    $("#nombreResponsable_accomodation_new").val('');
                    $("#contactoPersonal_accomodation_new").val('');
                    $("#razonSocial_accomodation_new").val('');
                    $("#celular_accomodation_new").val('');
                    $("#whatsapp_accomodation_new").val('0');
                    $("#website_accomodation_new").val('');
                    $("#cant_x1_accomodation_new").val('0');
                    $("#cant_x2_accomodation_new").val('0');
                    $("#cant_x3_accomodation_new").val('0');
                    $("#camt_x4_accomodation_new").val('0');
                    $("#cant_x5_accomodation_new").val('0');
                    $("#cant_x6_accomodation_new").val('0');
                    $("#cant_x7_accomodation_new").val('0');
                    $("#cant_x8_accomodation_new").val('0');
                    $("#capacitaPersonal_accomodation_new").val('0');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Alojamiento creado con éxito.',
                    });
                    table =   $("#alojamientos").DataTable();
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

const EditarAlojamiento = async (idAlojamiento) => {
    $.post(urlBase+"ObtenerAlojamiento",{idAlojamiento})
    .then(async (res)=>{
      res=JSON.parse(res);
      res.forEach(async (e)=>{
        $("#id_accomodation_edit").val(e.id_accomodation);
        $("#name_accomodation_edit").val(e.name_accomodation.toUpperCase());
        $("#phone_accomodation_edit").val(e.phone_accomodation.toUpperCase());
        $("#address_accomodation_edit").val(e.address_accomodation.toUpperCase());
        !e.email_accomodation ? e.email_accomodation = '' : '';
        $("#email_accomodation_edit").val(e.email_accomodation.toUpperCase());
        $("#type_accomodation_edit").val(e.id_type_accomodation.toUpperCase());
        !e.id_type_category_accomodation ? e.id_type_category_accomodation = '' : '';
        $("#category_accomodation_edit").val(e.id_type_category_accomodation);
        //Servicios
        let servicios = eval(e.ids_amenities_accomodation);
        servicios.forEach((e)=> {
            serviciosSelectEdit.setChoiceByValue(e);
        })
        $("#details_accomodation_edit").val(e.details_accomodation.toUpperCase());
        $("#celular_accomodation_edit").val(e.celular_accomodation);
        $("#whatsapp_accomodation_edit").val(e.whatsapp_accomodation);
        $("#nombreResponsable_accomodation_edit").val(e.nombreResponsable_accomodation);
        $("#contactoPersonal_accomodation_edit").val(e.contactoPersonal_accomodation);
        $("#razonSocial_accomodation_edit").val(e.razonSocial_accomodation);
        $("#website_accomodation_edit").val(e.website_accomodation);
        $("#redes_accomodation_edit").val(e.redes_accomodation);
        $("#capacitaPersonal_accomodation_edit").val(e.capacitaPersonal_accomodation);
         //Informacion especifica 
         await VerificarParametrosTipoAlojamientoEditar();
         //Editar segun tipo alojamiento
         switch(tipoAlojamiento){
            case 'hotel':
                $("#cant_x1_accomodation_edit_hotel").val(e.cant_x1_accomodation);
                $("#cant_x2_accomodation_edit_hotel").val(e.cant_x2_accomodation);
                $("#cant_x3_accomodation_edit_hotel").val(e.cant_x3_accomodation);
                $("#cant_x4_accomodation_edit_hotel").val(e.cant_x4_accomodation);
                $("#cant_x5_accomodation_edit_hotel").val(e.cant_x5_accomodation);
                $("#cant_x6_accomodation_edit_hotel").val(e.cant_x6_accomodation);
                $("#cant_x7_accomodation_edit_hotel").val(e.cant_x7_accomodation);
                $("#cant_x8_accomodation_edit_hotel").val(e.cant_x8_accomodation);
                $("#quantity_guest_accomodation_edit_hotel").val(e.quantity_guest_accomodation);
                $("#quantity_rooms_accomodation_edit_hotel").val(e.quantity_rooms_accomodation);
            break;   
            case 'hostel':
                $("#cant_x1_accomodation_edit_hotel").val(e.cant_x1_accomodation);
                $("#cant_x2_accomodation_edit_hotel").val(e.cant_x2_accomodation);
                $("#cant_x3_accomodation_edit_hotel").val(e.cant_x3_accomodation);
                $("#cant_x4_accomodation_edit_hotel").val(e.cant_x4_accomodation);
                $("#cant_x5_accomodation_edit_hotel").val(e.cant_x5_accomodation);
                $("#cant_x6_accomodation_edit_hotel").val(e.cant_x6_accomodation);
                $("#cant_x7_accomodation_edit_hotel").val(e.cant_x7_accomodation);
                $("#cant_x8_accomodation_edit_hotel").val(e.cant_x8_accomodation);
                $("#quantity_guest_accomodation_edit_hotel").val(e.quantity_guest_accomodation);
                $("#quantity_rooms_accomodation_edit_hotel").val(e.quantity_rooms_accomodation);
            break;     
            case 'camping':
                $("#cant_x1_accomodation_edit_camping").val(e.cant_x1_accomodation);
                $("#cant_x2_accomodation_edit_camping").val(e.cant_x2_accomodation);
                $("#cant_x3_accomodation_edit_camping").val(e.cant_x3_accomodation);
                $("#cant_x4_accomodation_edit_camping").val(e.cant_x4_accomodation);
                $("#cant_x5_accomodation_edit_camping").val(e.cant_x5_accomodation);
                $("#cant_x6_accomodation_edit_camping").val(e.cant_x6_accomodation);
                $("#cant_x7_accomodation_edit_camping").val(e.cant_x7_accomodation);
                $("#cant_x8_accomodation_edit_camping").val(e.cant_x8_accomodation);
                $("#quantity_guest_accomodation_edit_camping").val(e.quantity_guest_accomodation);
                $("#quantity_rooms_accomodation_edit_camping").val(e.quantity_rooms_accomodation);
            break;
            case 'inmobiliaria':
                $("#cant_x1_accomodation_edit_inmobiliaria").val(e.cant_x1_accomodation);
                $("#cant_x2_accomodation_edit_inmobiliaria").val(e.cant_x2_accomodation);
                $("#cant_x3_accomodation_edit_inmobiliaria").val(e.cant_x3_accomodation);
                $("#cant_x4_accomodation_edit_inmobiliaria").val(e.cant_x4_accomodation);
                $("#cant_x5_accomodation_edit_inmobiliaria").val(e.cant_x5_accomodation);
                $("#cant_x6_accomodation_edit_inmobiliaria").val(e.cant_x6_accomodation);
                $("#cant_x7_accomodation_edit_inmobiliaria").val(e.cant_x7_accomodation);
                $("#cant_x8_accomodation_edit_inmobiliaria").val(e.cant_x8_accomodation);
                $("#quantity_guest_accomodation_edit_inmobiliaria").val(e.quantity_guest_accomodation);
                $("#quantity_rooms_accomodation_edit_inmobiliaria").val(e.quantity_rooms_accomodation);
            break;
        }
        
      });
      $("#modalEditarAlojamiento").modal('show');
    });
}

const VerificarParametrosTipoAlojamientoEditar = async () => {
    tipoAlojamiento = $("#type_accomodation_edit").find('option:selected').text().toLowerCase();
    $(".input-group").prop('hidden',true);
    $("."+tipoAlojamiento).prop('hidden',false);
    $(".campoFijo").prop('hidden',false);
}

const ActualizarAlojamiento = () => {
    id_accomodation = $("#id_accomodation_edit").val();
    name_accomodation = $("#name_accomodation_edit").val();
    phone_accomodation = $("#phone_accomodation_edit").val();
    address_accomodation = $("#address_accomodation_edit").val();
    email_accomodation = $("#email_accomodation_edit").val();
    id_type_accomodation = $("#type_accomodation_edit").val();
    id_type_category_accomodation = $("#category_accomodation_edit").val();
    ids_amenities_accomodation = $("#ids_ameneties_edit").val();
    quantity_guest_accomodation = $("#quantity_guest_accomodation_edit").val();
    quantity_rooms_accomodation = $("#quantity_rooms_accomodation_edit").val();
    details_accomodation = $("#details_accomodation_edit").val();

    nombreResponsable = $("#nombreResponsable_accomodation_edit").val();
    contactoPersonal = $("#contactoPersonal_accomodation_edit").val();
    razonSocial = $("#razonSocial_accomodation_edit").val();
    celular = $("#celular_accomodation_edit").val();
    whatsapp = $("#whatsapp_accomodation_edit").val();
    website = $("#website_accomodation_edit").val();
    redes = $("#redes_accomodation_edit").val();

    /* EN EL CASO DE CAMPING, ASIGANAMOS PARCELAS A CAMPO X1, BUNGALOWS, CABAÑAS Y DORMIS CONSECUTIVAMENTE*/
    tipoAlojamiento = $("#type_accomodation_edit").find('option:selected').text().toLowerCase();
    switch(tipoAlojamiento.toLowerCase()){
        case 'hotel':
            cant_x1 = $("#cant_x1_accomodation_edit_hotel").val();
            cant_x2 = $("#cant_x2_accomodation_edit_hotel").val();
            cant_x3 = $("#cant_x3_accomodation_edit_hotel").val();
            cant_x4 = $("#cant_x4_accomodation_edit_hotel").val();
            cant_x5 = $("#cant_x5_accomodation_edit_hotel").val();
            cant_x6 = $("#cant_x6_accomodation_edit_hotel").val();
            cant_x7 = $("#cant_x7_accomodation_edit_hotel").val();
            cant_x8 = $("#cant_x8_accomodation_edit_hotel").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_edit_hotel").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_edit_hotel").val();
        break;   
        case 'hostel':
            cant_x1 = $("#cant_x1_accomodation_edit_hotel").val();
            cant_x2 = $("#cant_x2_accomodation_edit_hotel").val();
            cant_x3 = $("#cant_x3_accomodation_edit_hotel").val();
            cant_x4 = $("#cant_x4_accomodation_edit_hotel").val();
            cant_x5 = $("#cant_x5_accomodation_edit_hotel").val();
            cant_x6 = $("#cant_x6_accomodation_edit_hotel").val();
            cant_x7 = $("#cant_x7_accomodation_edit_hotel").val();
            cant_x8 = $("#cant_x8_accomodation_edit_hotel").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_edit_hotel").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_edit_hotel").val();
        break;     
        case 'camping':
            cant_x1 = $("#cant_x1_accomodation_edit_camping").val();
            cant_x2 = $("#cant_x2_accomodation_edit_camping").val();
            cant_x3 = $("#cant_x3_accomodation_edit_camping").val();
            cant_x4 = $("#cant_x4_accomodation_edit_camping").val();
            cant_x5 = $("#cant_x5_accomodation_edit_camping").val();
            cant_x6 = $("#cant_x6_accomodation_edit_camping").val();
            cant_x7 = $("#cant_x7_accomodation_edit_camping").val();
            cant_x8 = $("#cant_x8_accomodation_edit_camping").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_edit_camping").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_edit_camping").val();
        break;
        case 'inmobiliaria':
            cant_x1 = $("#cant_x1_accomodation_edit_inmobiliaria").val();
            cant_x2 = $("#cant_x2_accomodation_edit_inmobiliaria").val();
            cant_x3 = $("#cant_x3_accomodation_edit_inmobiliaria").val();
            cant_x4 = $("#cant_x4_accomodation_edit_inmobiliaria").val();
            cant_x5 = $("#cant_x5_accomodation_edit_inmobiliaria").val();
            cant_x6 = $("#cant_x6_accomodation_edit_inmobiliaria").val();
            cant_x7 = $("#cant_x7_accomodation_edit_inmobiliaria").val();
            cant_x8 = $("#cant_x8_accomodation_edit_inmobiliaria").val();
            quantity_guest_accomodation = $("#quantity_guest_accomodation_edit_inmobiliaria").val();
            quantity_rooms_accomodation = $("#quantity_rooms_accomodation_edit_inmobiliaria").val();
        break;
    }
    capacitaPersonal = $("#capacitaPersonal_accomodation_edit").val();


    if(name_accomodation && phone_accomodation && address_accomodation && id_type_accomodation && quantity_guest_accomodation && quantity_rooms_accomodation){
        let datos = {
            id_accomodation,
            name_accomodation,
            phone_accomodation,
            address_accomodation,
            email_accomodation,
            id_type_accomodation,
            id_type_category_accomodation,
            ids_amenities_accomodation : JSON.stringify(ids_amenities_accomodation),
            quantity_guest_accomodation,
            quantity_rooms_accomodation,
            details_accomodation,
            nombreResponsable,
            contactoPersonal,
            razonSocial,
            celular,
            whatsapp,
            website,
            cant_x1,
            cant_x2,
            cant_x3,
            cant_x4,
            cant_x5,
            cant_x6,
            cant_x7,
            cant_x8,
            capacitaPersonal,
            redes
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarAlojamiento",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarAlojamiento").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Alojamiento actualizado con éxito.',
                });
                table =   $("#alojamientos").DataTable();
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

const EliminarAlojamiento = (idAlojamiento) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este Alojamiento?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarAlojamiento",{idAlojamiento})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Alojamiento eliminado con éxito.',
            });
            table =   $("#alojamientos").DataTable();
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

const VerificarParametrosTipoAlojamiento = async () => {
    $(".input-group").prop('hidden',true);
    tipoAlojamiento = $("#type_accomodation_new").find('option:selected').text().toLowerCase();
    $("."+tipoAlojamiento).prop('hidden',false);
    $(".campoFijo").prop('hidden',false);
}

const filtrarAlojamientos = async () => {
    tipoAlojamiento = $("#type_accomodation_filter").val();
    servicios = $("#ids_ameneties_filter").val();
    servicios = JSON.stringify(servicios);
    $('#alojamientosFiltrados').DataTable().destroy();
    $('#alojamientosFiltrados').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerAlojamientosFiltrados.php?tipo='+tipoAlojamiento+'&servicios='+servicios
        },
        'columns': [
          { data: 'name_accomodation' },
          { data: 'address_accomodation' },
          { data: 'phone_accomodation' },
          { data: 'name_accomodations_types' },
          { data: 'name_categories_types' },
        ]
    });
}
