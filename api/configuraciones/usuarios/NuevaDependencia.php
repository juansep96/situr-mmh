<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarDependencia=$conexion->prepare("INSERT INTO dependences (name_dependence) VALUES (:1)");
$InsertarDependencia->bindParam(':1',$datos['name_dependence']);
if($InsertarDependencia->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarDependencia->errorInfo());
}

?>
