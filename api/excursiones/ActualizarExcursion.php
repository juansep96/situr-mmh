<?php


require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarActividad = $conexion->prepare("UPDATE excursions SET name_activity=:2,dia_activity=:3,details_activity=:4,hora_activity=:5,valor_activity=:6,reserva_activity=:7,direccion_activity=:8,transporte_activity=:9 WHERE id_activity=:1");
$ActualizarActividad->bindParam(':1',$datos['id_activity']);
$ActualizarActividad->bindParam(':2',$datos['nombre']);
$ActualizarActividad->bindParam(':3',$datos['dia']);
$ActualizarActividad->bindParam(':4',$datos['detalles']);
$ActualizarActividad->bindParam(':5',$datos['hora']);
$ActualizarActividad->bindParam(':6',$datos['valor']);
$ActualizarActividad->bindParam(':7',$datos['reserva']);
$ActualizarActividad->bindParam(':8',$datos['direccion']);
$ActualizarActividad->bindParam(':9',$datos['transporte']);
if($ActualizarActividad -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarActividad -> errorInfo());
}


?>
