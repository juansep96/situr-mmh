<?php

require_once('../PDO.php');

$idRC=$_POST['idRC'];

$EliminarRC=$conexion->prepare("UPDATE laguna_respCivil SET estado_respCivil=0 WHERE id_respCivil =:1");
$EliminarRC->bindParam(':1',$idRC);
if($EliminarRC->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarRC->errorInfo());
}


?>
