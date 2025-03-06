<?php


require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarAtractivo = $conexion->prepare("UPDATE tourist_atractions SET name_tourist_atraction=:1,address_tourist_atraction=:2,details_tourist_atraction=:3,horario_tourist_atraction=:4,dia_tourist_atraction=:5,contacto_tourist_atraction=:6 WHERE id_tourist_atraction=:7");
$ActualizarAtractivo->bindParam(':1',$datos['nombre']);
$ActualizarAtractivo->bindParam(':2',$datos['direccion']);
$ActualizarAtractivo->bindParam(':3',$datos['detalles']);
$ActualizarAtractivo->bindParam(':4',$datos['horario']);
$ActualizarAtractivo->bindParam(':5',$datos['dia']);
$ActualizarAtractivo->bindParam(':6',$datos['contacto']);
$ActualizarAtractivo->bindParam(':7',$datos['id_tourist_atraction']);
if($ActualizarAtractivo -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarAtractivo -> errorInfo());
}


?>
