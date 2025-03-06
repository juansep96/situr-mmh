<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$NuevoEstablecimientoGastronomico = $conexion->prepare("INSERT INTO gastronomy (id_type_gastronomy,ids_services_gastronomy,name_gastronomy,phone_gastronomy,address_gastronomy,email_gastronomy,quantity_guests_gastronomy,details_gastronomy,nombreResponsable_gastronomy,contactoPersonal_gastronomy,razonSocial_gastronomy,redes_gastronomy,horario_gastronomy) VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13)");
$NuevoEstablecimientoGastronomico -> bindParam(':1',$datos['id_type_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':2',$datos['ids_services_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':3',$datos['name_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':4',$datos['phone_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':5',$datos['address_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':6',$datos['email_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':7',$datos['quantity_guests_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':8',$datos['details_gastronomy']);
$NuevoEstablecimientoGastronomico -> bindParam(':9',$datos['nombreResponsable']);
$NuevoEstablecimientoGastronomico -> bindParam(':10',$datos['contactoPersonal']);
$NuevoEstablecimientoGastronomico -> bindParam(':11',$datos['razonSocial']);
$NuevoEstablecimientoGastronomico -> bindParam(':12',$datos['redes']);
$NuevoEstablecimientoGastronomico -> bindParam(':13',$datos['horario']);

if($NuevoEstablecimientoGastronomico ->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevoEstablecimientoGastronomico ->errorInfo());
}


?>
