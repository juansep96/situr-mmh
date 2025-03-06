<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);
$cuando = date("Y-m-d H:i:s");
$quien = $_SESSION['id_user'];

$NuevaAtencion = $conexion -> prepare("INSERT INTO tourist_attentions (date_tourist_attentions,quantity_people_tourist_attention,id_origin_tourist_attention,id_user_tourist_attention,details_tourist_attentions,idMotivo_attention,pais_attention) VALUES (:1,:2,:3,:4,:5,:6,:7)");
$NuevaAtencion->bindParam(':1',$cuando);
$NuevaAtencion->bindParam(':2',$datos['quantity_people_tourist_attention']);
$NuevaAtencion->bindParam(':3',$datos['id_origin_tourist_attention']);
$NuevaAtencion->bindParam(':4',$quien);
$NuevaAtencion->bindParam(':5',$datos['details_tourist_attentions']);
$NuevaAtencion->bindParam(':6',$datos['idMotivo']);
$NuevaAtencion->bindParam(':7',$datos['pais']);
if($NuevaAtencion->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevaAtencion->errorInfo());
}


?>
