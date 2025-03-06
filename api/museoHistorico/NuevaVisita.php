<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$NuevaVisita = $conexion -> prepare("INSERT INTO museoHistorico_visitas (dias_visita,horarios_visita,nombre_visita,cupo_visita) VALUES (:1,:2,:3,:4)");
$NuevaVisita->bindParam(':1',$datos['dias']);
$NuevaVisita->bindParam(':2',$datos['horarios']);
$NuevaVisita->bindParam(':3',$datos['nombre']);
$NuevaVisita->bindParam(':4',$datos['cupo']);
if($NuevaVisita->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevaVisita->errorInfo());
}


?>
