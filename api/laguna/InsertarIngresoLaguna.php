<?php

require_once('../PDO.php');

$datos=$_POST['data'];
$fechaHora = date('Y-m-d H:s:i');
$idUsuario = $_SESSION['id_user'];
$datos=json_decode($datos,true);

$NuevoIngresoLaguna = $conexion -> prepare("INSERT INTO laguna_incomes (argentino_income,idCiudad_income,idTipoLaguna_income,vehiculos_income,canas_income,embarcacion_income,deporte_income,deporteMotor_income,guiaPesca_income,formaPago_income,fechaHora_income,total_income,items_income,idUsuario_income) VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13,:14)");
$NuevoIngresoLaguna->bindParam(':1',$datos['paisOrigen']);
$NuevoIngresoLaguna->bindParam(':2',$datos['idCiudad']);
$NuevoIngresoLaguna->bindParam(':3',$datos['tipoTurista']);
$NuevoIngresoLaguna->bindParam(':4',$datos['vehiculos']);
$NuevoIngresoLaguna->bindParam(':5',$datos['canas']);
$NuevoIngresoLaguna->bindParam(':6',$datos['embarcaciones']);
$NuevoIngresoLaguna->bindParam(':7',$datos['deportes']);
$NuevoIngresoLaguna->bindParam(':8',$datos['deportesMotor']);
$NuevoIngresoLaguna->bindParam(':9',$datos['guia']);
$NuevoIngresoLaguna->bindParam(':10',$datos['formaPago']);
$NuevoIngresoLaguna->bindParam(':11',$fechaHora);
$NuevoIngresoLaguna->bindParam(':12',$datos['total']);
$NuevoIngresoLaguna->bindParam(':13',$datos['items']);
$NuevoIngresoLaguna->bindParam(':14',$idUsuario);

if($NuevoIngresoLaguna->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevoIngresoLaguna->errorInfo());
}


?>
