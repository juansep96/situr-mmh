<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarServicioAlojamiento=$conexion->prepare("UPDATE ameneties SET name_amenetie=:1 WHERE id_amenetie=:2");
$ActualizarServicioAlojamiento->bindParam(':1',$datos['name_amenetie']);
$ActualizarServicioAlojamiento->bindParam(':2',$datos['id_amenetie']);
if($ActualizarServicioAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarServicioAlojamiento->errorInfo());
}


?>
