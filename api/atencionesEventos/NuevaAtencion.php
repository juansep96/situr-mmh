<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);
$cuando = date("Y-m-d H:i:s");
$quien = $_SESSION['id_user'];

$NuevaAtencion = $conexion -> prepare("INSERT INTO events_surveys (quantity_people_events_survey,id_origin_events_survey,id_activity_events_survey,date_events_survey,id_user_events_survey,details_events_survey,pais_events_surveys) VALUES (:1,:2,:3,:4,:5,:6,:7)");
$NuevaAtencion->bindParam(':1',$datos['quantity_people_events_survey']);
$NuevaAtencion->bindParam(':2',$datos['id_origin_events_survey']);
$NuevaAtencion->bindParam(':3',$datos['id_activity_events_survey']);
$NuevaAtencion->bindParam(':4',$cuando);
$NuevaAtencion->bindParam(':5',$quien);
$NuevaAtencion->bindParam(':6',$datos['details_events_survey']);
$NuevaAtencion->bindParam(':7',$datos['paisOrigen']);

if($NuevaAtencion->execute()){
    echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevaAtencion->errorInfo());
}


?>
