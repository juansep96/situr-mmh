<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$NuevoTransporte = $conexion -> prepare("INSERT INTO transportations (id_type_transportation,ids_destines_transportation,name_transportation,phone_transportation,address_transportation,details_transportation,tarif_transportation,horarios_transportation,horarioAtencion_transportation,redes_transportation) VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10)");
$NuevoTransporte->bindParam(':1',$datos['id_type_transportation']);
$NuevoTransporte->bindParam(':2',$datos['ids_destines_transportation']);
$NuevoTransporte->bindParam(':3',$datos['name_transportation']);
$NuevoTransporte->bindParam(':4',$datos['phone_transportation']);
$NuevoTransporte->bindParam(':5',$datos['address_transportation']);
$NuevoTransporte->bindParam(':6',$datos['details_transportation']);
$NuevoTransporte->bindParam(':7',$datos['tarif_transportation']);
$NuevoTransporte->bindParam(':8',$datos['horarios_transportation']);
$NuevoTransporte->bindParam(':9',$datos['horarioAtencion_transportation']);
$NuevoTransporte->bindParam(':10',$datos['redes_transportation']);

if($NuevoTransporte->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevoTransporte->errorInfo());
}


?>
