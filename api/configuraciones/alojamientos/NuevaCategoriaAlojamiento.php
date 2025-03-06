<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarCategoriaAlojamiento=$conexion->prepare("INSERT INTO categories_types (name_categories_types) VALUES (:1)");
$InsertarCategoriaAlojamiento->bindParam(':1',$datos['name_categories_types']);
if($InsertarCategoriaAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarCategoriaAlojamiento->errorInfo());
}


?>
