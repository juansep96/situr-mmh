<?php

require_once('../PDO.php');

$datos=$_POST['data'];
$datos=json_decode($datos,true);
$fecha = date('Y-m-d');
$NuevaRC = $conexion -> prepare("INSERT INTO laguna_respCivil (fecha_respCivil,horaIngreso_respCivil,horaSalida_respCivil,apellido_respCivil,nombre_respCivil,dni_respCivil,domicilio_respCivil,idCiudad_respCivil,telefono_respCivil,email_respCivil,matricula_respCivil,caracteristicas_respCivil,apellidoConductor_respCivil,nombreConductor_respCivil,carnet_respCivil,acompanantes_respCivil,patenteVehiculo_respCivil) VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13,:14,:15,:16,:17)");
$NuevaRC->bindParam(':1',$fecha);
$NuevaRC->bindParam(':2',$datos['horaIngreso']);
$NuevaRC->bindParam(':3',$datos['horaSalida']);
$NuevaRC->bindParam(':4',$datos['apellido']);
$NuevaRC->bindParam(':5',$datos['nombre']);
$NuevaRC->bindParam(':6',$datos['dni']);
$NuevaRC->bindParam(':7',$datos['domicilio']);
$NuevaRC->bindParam(':8',$datos['idCiudad']);
$NuevaRC->bindParam(':9',$datos['telefono']);
$NuevaRC->bindParam(':10',$datos['email']);
$NuevaRC->bindParam(':11',$datos['matricula']);
$NuevaRC->bindParam(':12',$datos['caracteristicas']);
$NuevaRC->bindParam(':13',$datos['acompanantes']);
$NuevaRC->bindParam(':14',$datos['patenteVehiculo']);
$NuevaRC->bindParam(':15',$datos['nombreConductor']);
$NuevaRC->bindParam(':16',$datos['apellidoConductor']);
$NuevaRC->bindParam(':17',$datos['carnet']);
if($NuevaRC->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevaRC->errorInfo());
}


?>
