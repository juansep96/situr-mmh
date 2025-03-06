<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarCategoriaAlojamiento=$conexion->prepare("UPDATE categories_types SET name_categories_types=:1 WHERE id_categories_types=:2");
$ActualizarCategoriaAlojamiento->bindParam(':1',$datos['name_categories_types']);
$ActualizarCategoriaAlojamiento->bindParam(':2',$datos['id_categories_types']);
if($ActualizarCategoriaAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarCategoriaAlojamiento->errorInfo());
}


?>
