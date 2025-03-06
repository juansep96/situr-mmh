<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$NuevaInstitucion=$conexion->prepare("INSERT INTO instituciones (nombre_institucion,direccion_institucion,telefono_institucion) VALUES (:1,:2,:3)");
$NuevaInstitucion->bindParam(':1',$datos['nombre']);
$NuevaInstitucion->bindParam(':2',$datos['direccion']);
$NuevaInstitucion->bindParam(':3',$datos['telefono']);
if($NuevaInstitucion->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevaInstitucion->errorInfo());
}


?>
