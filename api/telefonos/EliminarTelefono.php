<?php


require_once('../PDO.php');

$idTelefono = $_POST['idTelefono'];

$EliminarTelefono = $conexion->prepare("UPDATE telefonosUtiles SET estado_tel=0 WHERE id_tel=:1");
$EliminarTelefono->bindParam(':1',$idTelefono);
if($EliminarTelefono -> execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($EliminarTelefono -> errorInfo());
}


?>
