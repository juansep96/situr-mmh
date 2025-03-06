<?php


require_once('../PDO.php');

$idExcursion = $_POST['idExcursion'];

$EliminarExcursion = $conexion->prepare("UPDATE excursions SET active_activity=0 WHERE id_activity=:1");
$EliminarExcursion->bindParam(':1',$idExcursion);
if($EliminarExcursion -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarExcursion -> errorInfo());
}


?>
