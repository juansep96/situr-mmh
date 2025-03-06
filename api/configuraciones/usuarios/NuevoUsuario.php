<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarUsuario=$conexion->prepare("INSERT INTO users (username_user,password_user,last_name_user,first_name_user,id_dependence_user,id_type_user) VALUES (:1,:2,:3,:4,:5,:6)");
$InsertarUsuario->bindParam(':1',$datos['username_user']);
$InsertarUsuario->bindParam(':2',$datos['password']);
$InsertarUsuario->bindParam(':3',$datos['first_name_user']);
$InsertarUsuario->bindParam(':4',$datos['last_name_user']);
$InsertarUsuario->bindParam(':5',$datos['id_dependence_user']);
$InsertarUsuario->bindParam(':6',$datos['id_user_type']);
if($InsertarUsuario->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarUsuario->errorInfo());
}


?>
