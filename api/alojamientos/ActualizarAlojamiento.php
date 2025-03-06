<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$ActualizarAlojamiento=$conexion->prepare("UPDATE accomodations SET id_type_accomodation=:1,id_type_category_accomodation=:2,name_accomodation=:3,phone_accomodation=:4,address_accomodation=:5,email_accomodation=:6,ids_amenities_accomodation=:7,quantity_guest_accomodation=:8,quantity_rooms_accomodation=:9,details_accomodation=:10,nombreResponsable_accomodation=:12,contactoPersonal_accomodation=:13,razonSocial_accomodation=:14,celular_accomodation=:15,whatsapp_accomodation=:16,redes_accomodation=:17,cant_x1_accomodation=:18,cant_x2_accomodation=:19,cant_x3_accomodation=:20,cant_x4_accomodation=:21,cant_x5_accomodation=:22,cant_x6_accomodation=:23,cant_x7_accomodation=:24,cant_x8_accomodation=:25,capacitacionPersonal_accomodation=:26,website_accomodation=:27 WHERE id_accomodation=:11");
$ActualizarAlojamiento->bindParam(':1',$datos['id_type_accomodation']);
$ActualizarAlojamiento->bindParam(':2',$datos['id_type_category_accomodation']);
$ActualizarAlojamiento->bindParam(':3',$datos['name_accomodation']);
$ActualizarAlojamiento->bindParam(':4',$datos['phone_accomodation']);
$ActualizarAlojamiento->bindParam(':5',$datos['address_accomodation']);
$ActualizarAlojamiento->bindParam(':6',$datos['email_accomodation']);
$ActualizarAlojamiento->bindParam(':7',$datos['ids_amenities_accomodation']);
$ActualizarAlojamiento->bindParam(':8',$datos['quantity_guest_accomodation']);
$ActualizarAlojamiento->bindParam(':9',$datos['quantity_rooms_accomodation']);
$ActualizarAlojamiento->bindParam(':10',$datos['details_accomodation']);
$ActualizarAlojamiento->bindParam(':11',$datos['id_accomodation']);
$ActualizarAlojamiento->bindParam(':12',$datos['nombreResponsable']);
$ActualizarAlojamiento->bindParam(':13',$datos['contactoPersonal']);
$ActualizarAlojamiento->bindParam(':14',$datos['razonSocial']);
$ActualizarAlojamiento->bindParam(':15',$datos['celular']);
$ActualizarAlojamiento->bindParam(':16',$datos['whatsapp']);
$ActualizarAlojamiento->bindParam(':17',$datos['redes']);
$ActualizarAlojamiento->bindParam(':18',$datos['cant_x1']);
$ActualizarAlojamiento->bindParam(':19',$datos['cant_x2']);
$ActualizarAlojamiento->bindParam(':20',$datos['cant_x3']);
$ActualizarAlojamiento->bindParam(':21',$datos['cant_x4']);
$ActualizarAlojamiento->bindParam(':22',$datos['cant_x5']);
$ActualizarAlojamiento->bindParam(':23',$datos['cant_x6']);
$ActualizarAlojamiento->bindParam(':24',$datos['cant_x7']);
$ActualizarAlojamiento->bindParam(':25',$datos['cant_x8']);
$ActualizarAlojamiento->bindParam(':26',$datos['capacitaPersonal']);
$ActualizarAlojamiento->bindParam(':27',$datos['website']);

if($ActualizarAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarAlojamiento->errorInfo());
}


?>
