<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$CrearAtractivo=$conexion->prepare("INSERT INTO tourist_atractions (name_tourist_atraction,horario_tourist_atraction,contacto_tourist_atraction,address_tourist_atraction,details_tourist_atraction,dia_tourist_atraction) VALUES (:1,:2,:3,:4,:5,:6)");
$CrearAtractivo->bindParam(':1',$datos['nombre']);
$CrearAtractivo->bindParam(':2',$datos['horario']);
$CrearAtractivo->bindParam(':3',$datos['contacto']);
$CrearAtractivo->bindParam(':4',$datos['direccion']);
$CrearAtractivo->bindParam(':5',$datos['detalles']);
$CrearAtractivo->bindParam(':6',$datos['dia']);
if($CrearAtractivo->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($CrearAtractivo->errorInfo());
}


?>
