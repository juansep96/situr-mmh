<?php

require_once('../PDO.php');

$idSalida=$_POST['idSalida'];

$EliminarRegistro=$conexion->prepare("UPDATE museoNaturales_salidas SET estado_salida=0 WHERE id_salida =:1");
$EliminarRegistro->bindParam(':1',$idSalida);
if($EliminarRegistro->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarRegistro->errorInfo());
}


?>
