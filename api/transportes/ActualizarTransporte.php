<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarTranporte = $conexion -> prepare("UPDATE transportations set id_type_transportation=:1,ids_destines_transportation=:2,name_transportation=:3,phone_transportation=:4,address_transportation=:5,details_transportation=:6,tarif_transportation=:7,horarios_transportation=:8,horarioAtencion_transportation=:9,redes_transportation=:10 WHERE id_transportation=:11");
$ActualizarTranporte->bindParam(':1',$datos['id_type_transportation']);
$ActualizarTranporte->bindParam(':2',$datos['ids_destines_transportation']);
$ActualizarTranporte->bindParam(':3',$datos['name_transportation']);
$ActualizarTranporte->bindParam(':4',$datos['phone_transportation']);
$ActualizarTranporte->bindParam(':5',$datos['address_transportation']);
$ActualizarTranporte->bindParam(':6',$datos['details_transportation']);
$ActualizarTranporte->bindParam(':7',$datos['tarif_transportation']);
$ActualizarTranporte->bindParam(':8',$datos['horarios_transportation']);
$ActualizarTranporte->bindParam(':9',$datos['horarioAtencion_transportation']);
$ActualizarTranporte->bindParam(':10',$datos['redes_transportation']);
$ActualizarTranporte->bindParam(':11',$datos['id_transportation']);


if($ActualizarTranporte->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarTranporte->errorInfo());
}


?>
