<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarTipoEstablecimientoGastronomico=$conexion->prepare("INSERT INTO gastronomy_types (name_gastronomy_type) VALUES (:1)");
$InsertarTipoEstablecimientoGastronomico->bindParam(':1',$datos['name_gastronomy_type']);
if($InsertarTipoEstablecimientoGastronomico->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarTipoEstablecimientoGastronomico->errorInfo());
}


?>
