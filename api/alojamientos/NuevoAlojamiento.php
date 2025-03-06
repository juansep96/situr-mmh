<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);

$CrearAlojamiento=$conexion->prepare("INSERT INTO accomodations (id_type_accomodation,id_type_category_accomodation,name_accomodation,phone_accomodation,address_accomodation,email_accomodation,ids_amenities_accomodation,quantity_guest_accomodation,quantity_rooms_accomodation,details_accomodation,nombreResponsable_accomodation,contactoPersonal_accomodation,razonSocial_accomodation,celular_accomodation,whatsapp_accomodation,redes_accomodation,cant_x1_accomodation,cant_x2_accomodation,cant_x3_accomodation,cant_x4_accomodation,cant_x5_accomodation,cant_x6_accomodation,cant_x7_accomodation,cant_x8_accomodation,capacitacionPersonal_accomodation,website_accomodation) VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13,:14,:15,:16,:17,:18,:19,:20,:21,:22,:23,:24,:25,:26)");
$CrearAlojamiento->bindParam(':1',$datos['id_type_accomodation']);
$CrearAlojamiento->bindParam(':2',$datos['id_type_category_accomodation']);
$CrearAlojamiento->bindParam(':3',$datos['name_accomodation']);
$CrearAlojamiento->bindParam(':4',$datos['phone_accomodation']);
$CrearAlojamiento->bindParam(':5',$datos['address_accomodation']);
$CrearAlojamiento->bindParam(':6',$datos['email_accomodation']);
$CrearAlojamiento->bindParam(':7',$datos['ids_amenities_accomodation']);
$CrearAlojamiento->bindParam(':8',$datos['quantity_guest_accomodation']);
$CrearAlojamiento->bindParam(':9',$datos['quantity_rooms_accomodation']);
$CrearAlojamiento->bindParam(':10',$datos['details_accomodation']);
$CrearAlojamiento->bindParam(':11',$datos['nombreResponsable']);
$CrearAlojamiento->bindParam(':12',$datos['contactoPersonal']);
$CrearAlojamiento->bindParam(':13',$datos['razonSocial']);
$CrearAlojamiento->bindParam(':14',$datos['celular']);
$CrearAlojamiento->bindParam(':15',$datos['whatsapp']);
$CrearAlojamiento->bindParam(':16',$datos['redes']);
$CrearAlojamiento->bindParam(':17',$datos['cant_x1']);
$CrearAlojamiento->bindParam(':18',$datos['cant_x2']);
$CrearAlojamiento->bindParam(':19',$datos['cant_x3']);
$CrearAlojamiento->bindParam(':20',$datos['cant_x4']);
$CrearAlojamiento->bindParam(':21',$datos['cant_x5']);
$CrearAlojamiento->bindParam(':22',$datos['cant_x6']);
$CrearAlojamiento->bindParam(':23',$datos['cant_x7']);
$CrearAlojamiento->bindParam(':24',$datos['cant_x8']);
$CrearAlojamiento->bindParam(':25',$datos['capacitacionPersonal']);
$CrearAlojamiento->bindParam(':26',$datos['website']);

if($CrearAlojamiento->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($CrearAlojamiento->errorInfo());
}


?>
