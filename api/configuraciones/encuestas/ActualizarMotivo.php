<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarMotivo=$conexion->prepare("UPDATE motivosConsulta SET nombre_motivo=:1 WHERE id_motivo=:2");
$ActualizarMotivo->bindParam(':1',$datos['nombre_motivo']);
$ActualizarMotivo->bindParam(':2',$datos['id_motivo']);
if($ActualizarMotivo->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarMotivo->errorInfo());
}


?>
