<?php

require_once('../PDO.php');

$idAtractivo = $_POST['idAtractivo'];

$ObtenerAtractivo = $conexion -> prepare("SELECT * FROM tourist_atractions WHERE id_tourist_atraction  =:1");
$ObtenerAtractivo -> bindParam(':1',$idAtractivo);
$ObtenerAtractivo -> execute();

$result = $ObtenerAtractivo->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
