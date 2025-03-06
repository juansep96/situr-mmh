let urlBase="./api/login/";

$(document).ready(function() {
    $("#password").keypress(function(e) {
       if(e.which == 13) {
         login();
       }
     });
});

function login(){
	let user = $("#username").val();
	let pass = $("#password").val();
	$.post(urlBase+"login",{user,pass})
	.then((data)=>{
		if(data=="OK"){
			Lobibox.notify('success', {
				pauseDelayOnHover: true,
				continueDelayOnInactiveTab: false,
				position: 'top right',
				icon: 'bx bx-check-circle',
				msg: 'Inicio de sesión correcto',
			});
			setInterval(function(){window.location.href = "./inicio.html";},1500);
		}else{
			Lobibox.notify('error', {
				pauseDelayOnHover: true,
				continueDelayOnInactiveTab: false,
				position: 'top right',
				icon: 'bx bx-message-error',
				msg: 'Credenciales inválidas.',
			});
		}
	});
}
const autoLogin = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    if(token){ //Validamos que sea token valido
        $.post(urlBase+"autenticar",{token})
        .then((data)=>{
            data = JSON.parse(data);
            switch (data.code) {
                case 200:
                    setInterval(function(){window.location.href = "./inicio.html";},1500);
                break;
                case 201:
                    html = '<i class="bx bxs-error-alt iconError" ></i><h4 style="text-transform:uppercase">Ocurrió un error. Intente ingresar nuevamente y si el error persiste, comuníquese con soporte. </h4>';
                break;
                case 202:
                    html = '<i class="bx bxs-no-entry iconError" ></i><h4 style="text-transform:uppercase">USTED NO TIENE ACCESO A ESTE SISTEMA. </h4>';
                break;            
                default:
                    html = '<i class="bx bxs-error-alt iconError" ></i><h4 style="text-transform:uppercase">Ocurrió un error. Intente ingresar nuevamente y si el error persiste, comuníquese con soporte. </h4>';
                break;
            }
            $("#mensaje").html(html);

        })
    }else{
        html = '<i class="bx bxs-error-alt iconError" ></i><h4 style="text-transform:uppercase">Ocurrió un error. Intente ingresar nuevamente y si el error persiste, comuníquese con soporte. </h4>';
        $("#mensaje").html(html);
     }
}
