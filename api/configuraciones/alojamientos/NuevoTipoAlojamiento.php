<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarTipoAlojamiento=$conexion->prepare("INSERT INTO accomodations_types (name_accomodations_types) VALUES (:1)");
$InsertarTipoAlojamiento->bindParam(':1',$datos['name_accomodation_type']);
if($InsertarTipoAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarTipoAlojamiento->errorInfo());
}


?>
