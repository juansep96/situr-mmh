<?php

require_once('../PDO.php');

if(isset($_POST['token']) && $_POST['token']!=''){

    $token = $_POST['token'];
    $url = 'https://autogestion.montehermoso.gov.ar/backoffice/public/api/developers/token/validate';
    $post = array('token'=>$token);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_POST,1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch, CURLOPT_VERBOSE,true);
    $respuesta = curl_exec ($ch);
    $respuesta = json_decode($respuesta, true);

    if(isset($respuesta['success'])){
        //Token valido, ahora tenemos que verificar si tiene acceso al sistema
        $dniPersona = $respuesta['user']['dni'];
        $IniciarSesion = $conexion->prepare("SELECT * from users left join roles ON id_role = id_type_user left join dependences on id_dependence_user = id_dependence WHERE dni_user=:1 AND active_user=1");
        $IniciarSesion -> bindParam(':1',$dniPersona);
        $IniciarSesion -> execute();
        if($IniciarSesion->RowCount()>0){
            foreach ($IniciarSesion as $Account){
                $_SESSION['id_user']=$Account['id_user'];
                $_SESSION['username_user']=$Account['username_user'];
                $_SESSION['id_role']=$Account['id_type_user'];
                $_SESSION['name_role']=$Account['name_role'];
                $_SESSION['first_name_user']=$Account['first_name_user'];
                $_SESSION['last_name_user']=$Account['last_name_user'];
                $_SESSION['id_dependence'] = $Account['id_dependence'];
                $_SESSION['name_dependence'] = $Account['name_dependence'];
            }
            //Actualizamos la ultima conexion
            $ActualizarUltimaConexion = $conexion -> prepare("UPDATE users SET last_login_user = :1 WHERE id_user =:2");
            $ActualizarUltimaConexion -> bindParam(':1',$cuando);
            $ActualizarUltimaConexion -> bindParam(':2',$_SESSION['id_user']);
            $ActualizarUltimaConexion -> execute();
            $code = 200;
            $error = "";
        }else{
            //Persona no tiene acceso
            $code = 202;
            $error = "NO TIENE ACCESO AL SISTEMA.";
        }
    }else{
        //Token invalido.
        $code = 201;
        $error = "TOKEN INVALIDO";
        
    }

}else{
    $code = 201;
    $error = "TOKEN NO PROPORCIONADO";
}

$data = [
    "code" => $code,
    "error" => $error
];

print_r(json_encode($data));

?>
