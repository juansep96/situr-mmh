<?php

require_once('../PDO.php');

$datos=$_POST['datos'];
$datos=json_decode($datos,true);
$cuando = date("Y-m-d H:i:s");
$quien = $_SESSION['id_user'];
$idDependencia = 7;
$NuevoRegistro = $conexion -> prepare("INSERT INTO registrosDiarios (fechaHora_registro,idCiudad_registro,grupoFamiliar_registro,primeraVez_registro,comentarios_registro,idUsuario_registro,idDependencia_registro,pais_registro) VALUES (:1,:2,:3,:4,:5,:6,:7,:8)");
$NuevoRegistro->bindParam(':1',$cuando);
$NuevoRegistro->bindParam(':2',$datos['idCiudad']);
$NuevoRegistro->bindParam(':3',$datos['grupo']);
$NuevoRegistro->bindParam(':4',$datos['primeraVez']);
$NuevoRegistro->bindParam(':5',$datos['comentarios']);
$NuevoRegistro->bindParam(':6',$quien);
$NuevoRegistro->bindParam(':7',$idDependencia);
$NuevoRegistro->bindParam(':8',$datos['pais']);


if($NuevoRegistro->execute()){
  echo "OK";
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($NuevoRegistro->errorInfo());
}


?>
