<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$idUsuario = $_SESSION['id_user'];

date_default_timezone_set("America/Argentina/Buenos_Aires");
setlocale(LC_ALL,"es_ES");
$cuando = date("Y-m-d H:i:s");

$NuevoCierre=$conexion->prepare("INSERT INTO arqueos (fechaHora_arqueo,idUsuario_arqueo,ingresos_arqueo,efectivo_arqueo,transferencia_arqueo,obs_arqueo) VALUES (:1,:2,:3,:4,:5,:6)");
$NuevoCierre->bindParam(':1',$cuando);
$NuevoCierre->bindParam(':2',$idUsuario);
$NuevoCierre->bindParam(':3',$datos['total']);
$NuevoCierre->bindParam(':4',$datos['efectivo']);
$NuevoCierre->bindParam(':5',$datos['transferencia']);
$NuevoCierre->bindParam(':6',$datos['obs']);
if($NuevoCierre->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevoCierre->errorInfo());
}


?>
