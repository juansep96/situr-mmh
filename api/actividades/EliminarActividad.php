<?php


require_once('../PDO.php');

$idActividad = $_POST['idActividad'];

$EliminarActividad = $conexion->prepare("UPDATE progr_activities SET active_activity=0 WHERE id_activity=:1");
$EliminarActividad->bindParam(':1',$idActividad);
if($EliminarActividad -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarActividad -> errorInfo());
}


?>
