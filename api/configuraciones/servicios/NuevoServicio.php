<?php

require_once('../../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$InsertarServicio=$conexion->prepare("INSERT INTO services_contact_book (name_service) VALUES (:1)");
$InsertarServicio->bindParam(':1',$datos['name_service']);
if($InsertarServicio->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($InsertarServicio->errorInfo());
}


?>
