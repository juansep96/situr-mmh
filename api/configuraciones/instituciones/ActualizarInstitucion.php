<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarInstitucion=$conexion->prepare("UPDATE instituciones SET nombre_institucion=:1,direccion_institucion=:2,telefono_institucion=:3 WHERE id_institucion=:4");
$ActualizarInstitucion->bindParam(':1',$datos['nombre']);
$ActualizarInstitucion->bindParam(':2',$datos['direccion']);
$ActualizarInstitucion->bindParam(':3',$datos['telefono']);
$ActualizarInstitucion->bindParam(':4',$datos['idInstitucion']);
if($ActualizarInstitucion->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarInstitucion->errorInfo());
}


?>
