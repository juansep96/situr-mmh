<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$CrearTelefono=$conexion->prepare("INSERT INTO telefonosUtiles (ente_tel,telefono_tel,mail_tel,horario_tel,direccion_tel,detalle_tel) VALUES (:1,:2,:3,:4,:5,:6)");
$CrearTelefono->bindParam(':1',$datos['ente']);
$CrearTelefono->bindParam(':2',$datos['telefono']);
$CrearTelefono->bindParam(':3',$datos['mail']);
$CrearTelefono->bindParam(':4',$datos['horario']);
$CrearTelefono->bindParam(':5',$datos['direccion']);
$CrearTelefono->bindParam(':6',$datos['detalle']);

if($CrearTelefono->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($CrearTelefono->errorInfo());
}


?>
