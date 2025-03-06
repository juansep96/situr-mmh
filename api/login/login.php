<?php

require_once('../PDO.php');

$cuando = date("Y-m-d H:i:s");
$user = $_POST['user'];
$password = $_POST['pass'];

$IniciarSesion = $conexion->prepare("SELECT * from users left join roles ON id_role = id_type_user left join dependences on id_dependence_user = id_dependence WHERE username_user=:1 AND password_user=:2 AND active_user=1");
$IniciarSesion -> bindParam(':1',$user);
$IniciarSesion -> bindParam(':2',$password);
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
    echo "OK";
}else{
    echo "NO";
}

?>
