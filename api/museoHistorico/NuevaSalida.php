<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);
$cuando = date("Y-m-d H:i:s");

$NuevaSalida = $conexion -> prepare("INSERT INTO museoHistorico_salidas (fecha_salida,curso_salida,idInstitucion_salida,cantidad_salida) VALUES (:1,:2,:3,:4)");
$NuevaSalida->bindParam(':1',$datos['fecha']);
$NuevaSalida->bindParam(':2',$datos['curso']);
$NuevaSalida->bindParam(':3',$datos['idInstitucion']);
$NuevaSalida->bindParam(':4',$datos['cantidad']);
if($NuevaSalida->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevaSalida->errorInfo());
}


?>
