<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarServicioEstablecimiento=$conexion->prepare("UPDATE services SET name_service=:1 WHERE id_service=:2");
$ActualizarServicioEstablecimiento->bindParam(':1',$datos['name_service']);
$ActualizarServicioEstablecimiento->bindParam(':2',$datos['id_service']);
if($ActualizarServicioEstablecimiento->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarServicioEstablecimiento->errorInfo());
}


?>
