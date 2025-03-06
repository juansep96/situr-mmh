<?php


require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarTelefono = $conexion->prepare("UPDATE telefonosUtiles SET ente_tel=:2,telefono_tel=:3,mail_tel=:4,horario_tel=:5,direccion_tel=:6,detalle_tel=:7 WHERE id_tel=:1");
$ActualizarTelefono->bindParam(':1',$datos['idTelefono']);
$ActualizarTelefono->bindParam(':2',$datos['ente']);
$ActualizarTelefono->bindParam(':3',$datos['telefono']);
$ActualizarTelefono->bindParam(':4',$datos['mail']);
$ActualizarTelefono->bindParam(':5',$datos['horario']);
$ActualizarTelefono->bindParam(':6',$datos['direccion']);
$ActualizarTelefono->bindParam(':7',$datos['detalle']);
if($ActualizarTelefono -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarTelefono -> errorInfo());
}


?>
