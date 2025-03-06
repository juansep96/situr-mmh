<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarUsuario=$conexion->prepare("UPDATE users SET username_user=:1,password_user=:2,first_name_user=:3,last_name_user=:4,id_dependence_user=:5,id_type_user=:6 WHERE id_user=:7");
$ActualizarUsuario->bindParam(':1',$datos['username_user']);
$ActualizarUsuario->bindParam(':2',$datos['password']);
$ActualizarUsuario->bindParam(':3',$datos['first_name_user']);
$ActualizarUsuario->bindParam(':4',$datos['last_name_user']);
$ActualizarUsuario->bindParam(':5',$datos['id_dependence_user']);
$ActualizarUsuario->bindParam(':6',$datos['id_user_type']);
$ActualizarUsuario->bindParam(':7',$datos['id_user']);
if($ActualizarUsuario->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarUsuario->errorInfo());
}


?>
