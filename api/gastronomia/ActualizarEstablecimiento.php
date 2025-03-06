<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarEstablecimiento = $conexion->prepare("UPDATE gastronomy SET id_type_gastronomy=:1,ids_services_gastronomy=:2,name_gastronomy=:3,phone_gastronomy=:4,address_gastronomy=:5,email_gastronomy=:6,quantity_guests_gastronomy=:7,details_gastronomy=:8,nombreResponsable_gastronomy=:10,contactoPersonal_gastronomy=:11,razonSocial_gastronomy=:12,redes_gastronomy=:13,horario_gastronomy=:14 WHERE id_gastronomy=:9");
$ActualizarEstablecimiento -> bindParam(':1',$datos['id_type_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':2',$datos['ids_services_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':3',$datos['name_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':4',$datos['phone_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':5',$datos['address_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':6',$datos['email_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':7',$datos['quantity_guests_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':8',$datos['details_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':9',$datos['id_gastronomy']);
$ActualizarEstablecimiento -> bindParam(':10',$datos['nombreResponsable']);
$ActualizarEstablecimiento -> bindParam(':11',$datos['contactoPersonal']);
$ActualizarEstablecimiento -> bindParam(':12',$datos['razonSocial']);
$ActualizarEstablecimiento -> bindParam(':13',$datos['redes']);
$ActualizarEstablecimiento -> bindParam(':14',$datos['horario']);

if($ActualizarEstablecimiento -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarEstablecimiento -> errorInfo());
}


?>
