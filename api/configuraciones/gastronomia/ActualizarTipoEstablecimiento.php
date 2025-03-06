<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarTipoEstablecimiento=$conexion->prepare("UPDATE gastronomy_types SET name_gastronomy_type=:1 WHERE id_gastronomy_type=:2");
$ActualizarTipoEstablecimiento->bindParam(':1',$datos['name_gastronomy_type']);
$ActualizarTipoEstablecimiento->bindParam(':2',$datos['id_gastronomy_type']);
if($ActualizarTipoEstablecimiento->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarTipoEstablecimiento->errorInfo());
}


?>
