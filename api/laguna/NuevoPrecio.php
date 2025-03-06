<?php

require_once('../PDO.php');

$datos=$_POST['data'];
$datos=json_decode($datos,true);
$NuevoPrecio = $conexion -> prepare("INSERT INTO laguna_prices (nombrePrecio_price,precioResidente_price,precioTurista_price) VALUES (:1,:2,:3)");
$NuevoPrecio->bindParam(':1',$datos['nombrePrecio']);
$NuevoPrecio->bindParam(':2',$datos['valorTurista']);
$NuevoPrecio->bindParam(':3',$datos['valorResidente']);
if($NuevoPrecio->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevoPrecio->errorInfo());
}


?>
