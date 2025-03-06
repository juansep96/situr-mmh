<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarMotivo=$conexion->prepare("INSERT INTO motivosConsulta (nombre_motivo) VALUES (:1)");
$InsertarMotivo->bindParam(':1',$datos['nombre_motivo']);
if($InsertarMotivo->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarMotivo->errorInfo());
}


?>
