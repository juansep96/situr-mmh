<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarDependencia=$conexion->prepare("UPDATE dependences SET name_dependence=:1 WHERE id_dependence=:2");
$ActualizarDependencia->bindParam(':1',$datos['name_dependence']);
$ActualizarDependencia->bindParam(':2',$datos['id_dependence']);
if($ActualizarDependencia->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarDependencia->errorInfo());
}


?>
