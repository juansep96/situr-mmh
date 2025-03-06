<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$CrearActividad=$conexion->prepare("INSERT INTO excursions (name_activity,dia_activity,details_activity,hora_activity,valor_activity,reserva_activity,direccion_activity,transporte_activity) VALUES (:1,:2,:3,:4,:5,:6,:7,:8)");
$CrearActividad->bindParam(':1',$datos['nombre']);
$CrearActividad->bindParam(':2',$datos['dia']);
$CrearActividad->bindParam(':3',$datos['detalles']);
$CrearActividad->bindParam(':4',$datos['hora']);
$CrearActividad->bindParam(':5',$datos['valor']);
$CrearActividad->bindParam(':6',$datos['reserva']);
$CrearActividad->bindParam(':7',$datos['direccion']);
$CrearActividad->bindParam(':8',$datos['transporte']);
if($CrearActividad->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($CrearActividad->errorInfo());
}


?>
