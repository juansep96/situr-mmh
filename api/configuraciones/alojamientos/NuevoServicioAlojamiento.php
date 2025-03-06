<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarServicioAlojamiento=$conexion->prepare("INSERT INTO ameneties (name_amenetie) VALUES (:1)");
$InsertarServicioAlojamiento->bindParam(':1',$datos['name_amenetie']);
if($InsertarServicioAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarServicioAlojamiento->errorInfo());
}


?>
