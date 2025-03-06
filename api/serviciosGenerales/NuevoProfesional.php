<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$NuevoProfesional = $conexion->prepare("INSERT INTO contact_book (ids_services_contact,owner_contact,personalContact_contact,name_contact,phone_contact,address_contact,horario_contact,details_contact) VALUES (:1,:2,:3,:4,:5,:6,:7,:8)");
$NuevoProfesional -> bindParam(':1',$datos['categorias']);
$NuevoProfesional -> bindParam(':2',$datos['owner']);
$NuevoProfesional -> bindParam(':3',$datos['personalContact']);
$NuevoProfesional -> bindParam(':4',$datos['razonSocial']);
$NuevoProfesional -> bindParam(':5',$datos['phone']);
$NuevoProfesional -> bindParam(':6',$datos['address']);
$NuevoProfesional -> bindParam(':7',$datos['horarios']);
$NuevoProfesional -> bindParam(':8',$datos['details']);


if($NuevoProfesional ->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevoProfesional ->errorInfo());
}


?>
