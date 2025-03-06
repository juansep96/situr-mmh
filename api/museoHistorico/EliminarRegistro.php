<?php

require_once('../PDO.php');

$idRegistro=$_POST['idRegistro'];

$EliminarRegistro=$conexion->prepare("UPDATE registrosDiarios SET estado_registro=0 WHERE id_registro =:1");
$EliminarRegistro->bindParam(':1',$idRegistro);
if($EliminarRegistro->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarRegistro->errorInfo());
}


?>
