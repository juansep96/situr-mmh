<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarTipoTransporte=$conexion->prepare("UPDATE transportations_types SET name_transportations_type=:1 WHERE id_transportations_type=:2");
$ActualizarTipoTransporte->bindParam(':1',$datos['name_transportations_type']);
$ActualizarTipoTransporte->bindParam(':2',$datos['id_transportations_type']);
if($ActualizarTipoTransporte->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarTipoTransporte->errorInfo());
}


?>
