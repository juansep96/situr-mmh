var urlBase="./api/serviciosGenerales/";
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
    cargarProfesionales();
    cargarCategoriasSelect();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const cargarProfesionales = () => {
    $('#profesionales').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerProfesionales'
        },
        'columns': [
          { data: 'ids_services_contact' },
          { data: 'owner_contact' },
          { data: 'personalContact_contact' },
          { data: 'name_contact' },
          { data: 'phone_contact' },
          { data: 'address_contact' },
          { data: 'horario_contact' },
          { data: 'details_contact' },
          { data: 'acciones_contact' },
        ]
    });
}

const cargarCategoriasSelect = () => {
    $.post(urlBase+"ObtenerCategoriasSelect")
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
        serviciosSelect = new Choices('#ids_services_prof_new', {
            removeItemButton: true,
            searchResultLimit:50,
            renderChoiceLimit:50,
            choices:arrayServicios
        });
        serviciosSelectEdit = new Choices('#ids_services_prof_edit', {
            removeItemButton: true,
            searchResultLimit:50,
            renderChoiceLimit:50,
            choices:arrayServicios
        });
        serviciosSelectView = new Choices('#ids_services_prof', {
            removeItemButton: true,
            searchResultLimit:50,
            renderChoiceLimit:50,
            choices:arrayServicios
        });
    });     
}


const guardarProfesional = () => {
    owner = $("#owner_prof_new").val();
    personalContact = $("#personalContact_prof_new").val();
    categorias = $("#ids_services_prof_new").val();
    razonSocial = $("#name_prof_new").val();
    address = $("#address_prof_new").val();
    phone = $("#phone_prof_new").val();
    horarios = $("#horario_prof_new").val();
    details = $("#details_prof_new").val();

    if(owner && categorias && razonSocial){
        let datos = {
            owner,
            personalContact,
            categorias : JSON.stringify(categorias),
            razonSocial,
            address,
            phone,
            horarios,
            details,
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoProfesional",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoProfesional").modal('hide');
                    $("#owner_prof_new").val('');
                    $("#personalContact_prof_new").val('');
                    $("#ids_services_prof_new").val('');
                    $("#name_prof_new").val('');
                    $("#address_prof_new").val('');
                    $("#phone_prof_new").val('');
                    $("#horario_prof_new").val('');
                    $("#details_prof_new").val('');
                    serviciosSelect.removeActiveItems();
                    serviciosSelect.destroy();
                    serviciosSelect = new Choices('#ids_services_prof_new', {
                        choices:arrayServicios
                    });
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Profesional creado con éxito.',
                    });
                    table =   $("#profesionales").DataTable();
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

const VerProfesional = (idProfesional) => {
    serviciosSelectView.removeActiveItems();
    $(".filaServicios").remove();
    $.post(urlBase+"ObtenerProfesional",{idProfesional})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#owner_prof").val(e.owner_contact);
        $("#personalContact_prof").val(e.personalContact_contact);
        $("#name_prof").val(e.name_contact);
        $("#address_prof").val(e.address_contact);
        $("#phone_prof").val(e.phone_contact);
        $("#horario_prof").val(e.horario_contact);
        $("#details_prof").val(e.details_contact);
        //Servicios
        let servicios = eval(e.ids_services_contact);
        servicios.forEach((f)=> {
            serviciosSelectView.setChoiceByValue(f[0]);
         })
      });
      $("#modalVerProfesional").modal('show');
    });
}

const EditarProfesional = (idProfesional) => {
    serviciosSelectEdit.removeActiveItems();
    $.post(urlBase+"ObtenerProfesional",{idProfesional})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#idProfesional_edit").val(e.id_contact);
        $("#owner_prof_edit").val(e.owner_contact);
        $("#personalContact_prof_edit").val(e.personalContact_contact);
        $("#name_prof_edit").val(e.name_contact);
        $("#address_prof_edit").val(e.address_contact);
        $("#phone_prof_edit").val(e.phone_contact);
        $("#horario_prof_edit").val(e.horario_contact);
        $("#details_prof_edit").val(e.details_contact);
        //Servicios
        let servicios = eval(e.ids_services_contact);
        servicios.forEach((f)=> {
            serviciosSelectEdit.setChoiceByValue(f[0]);
         })
      });
      $("#modalEditarProfesional").modal('show');
    });
}

const actualizarProfesional = () => {
    idProfesional = $("#idProfesional_edit").val();
    owner = $("#owner_prof_edit").val();
    personalContact = $("#personalContact_prof_edit").val();
    categorias = $("#ids_services_prof_edit").val();
    razonSocial = $("#name_prof_edit").val();
    address = $("#address_prof_edit").val();
    phone = $("#phone_prof_edit").val();
    horarios = $("#horario_prof_edit").val();
    details = $("#details_prof_edit").val();
    if(idProfesional && owner && categorias && razonSocial){
        let datos = {
            owner,
            personalContact,
            categorias : JSON.stringify(categorias),
            razonSocial,
            address,
            phone,
            horarios,
            details,
            idProfesional
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"ActualizarProfesional",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalEditarProfesional").modal('hide');
                    $("#idProfesional_edit").val('');
                    $("#owner_prof_edit").val('');
                    $("#personalContact_prof_edit").val('');
                    serviciosSelectEdit.removeActiveItems();
                    $("#name_prof_edit").val('');
                    $("#address_prof_edit").val('');
                    $("#phone_prof_edit").val('');
                    $("#horario_prof_edit").val('');
                    $("#details_prof_edit").val('');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Profesional actualizado con éxito.',
                    });
                    table =   $("#profesionales").DataTable();
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


const EliminarProfesional = (idProfesional) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este Profesional?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarProfesional",{idProfesional})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Profesional eliminado con éxito.',
            });
            table =   $("#profesionales").DataTable();
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