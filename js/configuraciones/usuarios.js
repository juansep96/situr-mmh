var urlBase="./api/configuraciones/usuarios/";

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
    CargarDependenciasSelect();
    CargarUsuarios();
    CargarDependencias();
});

const cerramosModal = () => {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

const CargarDependenciasSelect = () => {
    $("#dependence_edit").empty();
    $("#dependence_new").empty();
    $.post(urlBase+"ObtenerDependenciasSelect")
    .then((data)=>{
      data=JSON.parse(data);
      data.forEach((e)=>{
          var opcion = "<option value='"+e.id_dependence+"'>"+e.name_dependence.toUpperCase()+"</option>";
        $("#dependence_edit").append(opcion);
        $("#dependence_new").append(opcion);
      })
    });
}

const CargarUsuarios = () => {
    $('#usuarios').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerUsuarios'
        },
        'columns': [
          { data: 'last_name_user' },
          { data: 'first_name_user' },
          { data: 'username_user' },
          { data: 'name_dependence' },
          { data: 'name_role' },
          { data: 'last_login_user' },
          { data: 'acciones_user' },
        ]
    });
}

const EditarUsuario = (idUsuario) => {
    $.post(urlBase+"ObtenerUsuario",{idUsuario})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_user_edit").val(e.id_user);
        $("#last_name_edit").val(e.last_name_user.toUpperCase());
        $("#first_name_edit").val(e.first_name_user.toUpperCase());
        $("#username_edit").val(e.username_user.toUpperCase());
        $("#password_edit").val(e.password_user);
        $("#password2_edit").val(e.password_user);
        $("#dependence_edit").val(e.id_dependence_user);
        $("#permisos_edit").val(e.id_type_user);
      });
      $("#modalEditarUsuario").modal('show');
    });
}

const ActualizarUsuario = () => {
    id_user = $("#id_user_edit").val();
    first_name_user = $("#first_name_edit").val();
    last_name_user = $("#last_name_edit").val();
    username_user = $("#username_edit").val();
    password = $("#password_edit").val();
    password2 = $("#password2_edit").val();
    id_dependence_user = $("#dependence_edit").val();
    id_user_type = $("#permisos_edit").val();
    if(id_user && first_name_user && last_name_user && username_user && password && password2 && id_dependence_user && id_user_type){
        if(password == password2){
            let datos = {
                id_user,
                first_name_user,
                last_name_user,
                username_user,
                password,
                id_dependence_user,
                id_user_type
            };
            datos = JSON.stringify(datos);
            $.post(urlBase+"ActualizarUsuario",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalEditarUsuario").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Usuario actualizado con éxito.',
                    });
                    table =   $("#usuarios").DataTable();
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
            Lobibox.notify('warning', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-message-error',
                msg: 'Las contraseñas no coinciden.',
                });
        }        
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

const EliminarUsuario = (idUsuario) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar este Usuario?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarUsuario",{idUsuario})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Usuario eliminado con éxito.',
            });
            table =   $("#usuarios").DataTable();
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

const GuardarUsuario = () => {
    first_name_user = $("#first_name_new").val();
    last_name_user = $("#last_name_new").val();
    username_user = $("#username_new").val();
    password = $("#password_new").val();
    password2 = $("#password2_new").val();
    id_dependence_user = $("#dependence_new").val();
    id_user_type = $("#permisos_new").val();
    if(first_name_user && last_name_user && username_user && password && password2 && id_dependence_user && id_user_type){
        if(password == password2){
            let datos = {
                first_name_user,
                last_name_user,
                username_user,
                password,
                id_dependence_user,
                id_user_type
            };
            datos = JSON.stringify(datos);
            $.post(urlBase+"NuevoUsuario",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevoUsuario").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Usuario creado con éxito.',
                    });
                    table =   $("#usuarios").DataTable();
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
            Lobibox.notify('warning', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-message-error',
                msg: 'Las contraseñas no coinciden.',
                });
        }        
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

const CargarDependencias = () => {
    $('#dependences').DataTable({
        'responsive': false,
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        dom: 'Blfrtip',
          buttons: [
              'excel', 'pdf', 'print'
          ],
        'ajax': {
            'url':urlBase+'ObtenerDependencias'
        },
        'columns': [
          { data: 'name_dependence' },
          { data: 'acciones_dependence' },
        ]
    });
}

const EditarDependencia = (idDependencia) => {
    $.post(urlBase+"ObtenerDependencia",{idDependencia})
    .then((res)=>{
      res=JSON.parse(res);
      res.forEach((e)=>{
        $("#id_dependence_edit").val(e.id_dependence);
        $("#name_dependence_edit").val(e.name_dependence.toUpperCase());
      });
      $("#modalEditarDependencia").modal('show');
    });
}

const ActualizarDependencia = () => {
    id_dependence = $("#id_dependence_edit").val();
    name_dependence = $("#name_dependence_edit").val();
    if(id_dependence && name_dependence){
        let datos = {
            id_dependence,
            name_dependence
        };
        datos = JSON.stringify(datos);
        $.post(urlBase+"ActualizarDependencia",{datos})
        .then((res)=>{
            if(res=="OK"){
                $("#modalEditarDependencia").modal('hide');
                cerramosModal();
                Lobibox.notify('success', {
                    pauseDelayOnHover: true,
                    continueDelayOnInactiveTab: false,
                    position: 'top right',
                    icon: 'bx bx-check-circle',
                    msg: 'Dependencia actualizada con éxito.',
                });
                table =   $("#dependences").DataTable();
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

const EliminarDependencia = (idDependencia) => {
    Lobibox.confirm({
        msg: "Seguro  que desea eliminar esta Dependencia?",
        callback: function ($this, type, ev) {
          if(type=="yes"){
            $.post(urlBase+"EliminarDependencia",{idDependencia})
            .then(()=>{
              Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Dependencia eliminada con éxito.',
            });
            table =   $("#dependences").DataTable();
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

const GuardarDependencia = () => {
    name_dependence = $("#name_dependence_new").val();
    if(name_dependence){
        let datos = {
            name_dependence
        };
        datos = JSON.stringify(datos);
            $.post(urlBase+"NuevaDependencia",{datos})
            .then((res)=>{
                if(res=="OK"){
                    $("#modalNuevaDependencia").modal('hide');
                    cerramosModal();
                    Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Dependencia creada con éxito.',
                    });
                    table =   $("#dependences").DataTable();
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