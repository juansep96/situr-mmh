<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarTipoTransporte=$conexion->prepare("INSERT INTO transportations_types (name_transportations_type) VALUES (:1)");
$InsertarTipoTransporte->bindParam(':1',$datos['name_transportations_type']);
if($InsertarTipoTransporte->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarTipoTransporte->errorInfo());
}


?>
