<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarSalida=$conexion->prepare("UPDATE museoHistorico_salidas SET fecha_salida=:1,curso_salida=:2,idInstitucion_salida=:3,cantidad_salida=:4 WHERE id_salida=:5");
$ActualizarSalida->bindParam(':1',$datos['fecha']);
$ActualizarSalida->bindParam(':2',$datos['curso']);
$ActualizarSalida->bindParam(':3',$datos['idInstitucion']);
$ActualizarSalida->bindParam(':4',$datos['cantidad']);
$ActualizarSalida->bindParam(':5',$datos['idSalida']);
if($ActualizarSalida->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarSalida->errorInfo());
}


?>
