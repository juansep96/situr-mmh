<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarServicio=$conexion->prepare("UPDATE services_contact_book SET name_service=:1 WHERE id_service=:2");
$ActualizarServicio->bindParam(':1',$datos['name_service']);
$ActualizarServicio->bindParam(':2',$datos['id_service']);
if($ActualizarServicio->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarServicio->errorInfo());
}


?>
