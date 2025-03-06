<?php

require_once('../PDO.php');

$idPrecio=$_POST['idPrecio'];

$EliminarPrecio=$conexion->prepare("UPDATE laguna_prices SET estado_price=0 WHERE id_price=:1");
$EliminarPrecio->bindParam(':1',$idPrecio);
if($EliminarPrecio->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarPrecio->errorInfo());
}


?>
