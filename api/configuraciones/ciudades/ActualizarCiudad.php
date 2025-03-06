<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarCiudad=$conexion->prepare("UPDATE cities SET id_province_city=:1,name_city=:2 WHERE id_city=:3");
$ActualizarCiudad->bindParam(':1',$datos['id_province_city']);
$ActualizarCiudad->bindParam(':2',$datos['name_city']);
$ActualizarCiudad->bindParam(':3',$datos['id_city']);
if($ActualizarCiudad->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarCiudad->errorInfo());
}


?>
