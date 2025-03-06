<?php

require_once('../PDO.php');

$datos=$_POST['data'];
$datos=json_decode($datos,true);

$ActualizarPrecio=$conexion->prepare("UPDATE laguna_prices SET nombrePrecio_price=:1,precioResidente_price=:2,precioTurista_price=:3 WHERE id_price=:4");
$ActualizarPrecio->bindParam(':1',$datos['nombrePrecio']);
$ActualizarPrecio->bindParam(':2',$datos['valorResidente']);
$ActualizarPrecio->bindParam(':3',$datos['valorTurista']);
$ActualizarPrecio->bindParam(':4',$datos['idPrecio']);

if($ActualizarPrecio->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarPrecio->errorInfo());
}


?>
