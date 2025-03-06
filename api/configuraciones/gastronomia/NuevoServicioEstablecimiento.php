<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarServicioEstablecimientoGastronomico=$conexion->prepare("INSERT INTO services (name_service) VALUES (:1)");
$InsertarServicioEstablecimientoGastronomico->bindParam(':1',$datos['name_service']);
if($InsertarServicioEstablecimientoGastronomico->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarServicioEstablecimientoGastronomico->errorInfo());
}


?>
