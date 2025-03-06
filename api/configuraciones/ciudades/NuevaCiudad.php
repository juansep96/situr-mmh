<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarCiudad=$conexion->prepare("INSERT INTO cities (id_province_city,name_city) VALUES (:1,:2)");
$InsertarCiudad->bindParam(':1',$datos['id_province_city']);
$InsertarCiudad->bindParam(':2',$datos['name_city']);
if($InsertarCiudad->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarCiudad->errorInfo());
}


?>
