<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarVisita=$conexion->prepare("UPDATE museoHistorico_visitas SET dias_visita=:1,horarios_visita=:2,nombre_visita=:3,cupo_visita=:4 WHERE id_visita=:5");
$ActualizarVisita->bindParam(':1',$datos['dias']);
$ActualizarVisita->bindParam(':2',$datos['horarios']);
$ActualizarVisita->bindParam(':3',$datos['nombre']);
$ActualizarVisita->bindParam(':4',$datos['cupo']);
$ActualizarVisita->bindParam(':5',$datos['idVisita']);
if($ActualizarVisita->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarVisita->errorInfo());
}


?>
