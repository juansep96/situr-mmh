<?php

require_once('../PDO.php');

$idIngreso=$_POST['idIngreso'];

$EliminarIngreso=$conexion->prepare("UPDATE laguna_incomes SET active_income=0 WHERE id_income=:1");
$EliminarIngreso->bindParam(':1',$idIngreso);
if($EliminarIngreso->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarIngreso->errorInfo());
}


?>
