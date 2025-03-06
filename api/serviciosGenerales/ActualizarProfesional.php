<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarProfesional = $conexion->prepare("UPDATE contact_book SET ids_services_contact=:1,owner_contact=:2,personalContact_contact=:3,name_contact=:4,phone_contact=:5,address_contact=:6,horario_contact=:7,details_contact=:8 WHERE id_contact=:9");
$ActualizarProfesional -> bindParam(':1',$datos['categorias']);
$ActualizarProfesional -> bindParam(':2',$datos['owner']);
$ActualizarProfesional -> bindParam(':3',$datos['personalContact']);
$ActualizarProfesional -> bindParam(':4',$datos['razonSocial']);
$ActualizarProfesional -> bindParam(':5',$datos['phone']);
$ActualizarProfesional -> bindParam(':6',$datos['address']);
$ActualizarProfesional -> bindParam(':7',$datos['horarios']);
$ActualizarProfesional -> bindParam(':8',$datos['details']);
$ActualizarProfesional -> bindParam(':9',$datos['idProfesional']);


if($ActualizarProfesional -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarProfesional -> errorInfo());
}


?>
