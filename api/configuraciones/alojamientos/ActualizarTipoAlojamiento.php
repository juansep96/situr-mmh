<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarTipoAlojamiento=$conexion->prepare("UPDATE accomodations_types SET name_accomodations_types=:1 WHERE id_accomodations_types=:2");
$ActualizarTipoAlojamiento->bindParam(':1',$datos['name_accomodations_types']);
$ActualizarTipoAlojamiento->bindParam(':2',$datos['id_accomodations_types']);
if($ActualizarTipoAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarTipoAlojamiento->errorInfo());
}


?>
