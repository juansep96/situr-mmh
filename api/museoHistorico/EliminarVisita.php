<?php

require_once('../PDO.php');

$idVisita=$_POST['idVisita'];

$EliminarVisita=$conexion->prepare("UPDATE museoHistorico_visitas SET estado_visita=0 WHERE id_visita =:1");
$EliminarVisita->bindParam(':1',$idVisita);
if($EliminarVisita->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarVisita->errorInfo());
}


?>
