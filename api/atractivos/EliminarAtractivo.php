<?php

require_once('../PDO.php');

$idAtractivo = $_POST['idAtractivo'];

$EliminarAtractivo = $conexion -> prepare("UPDATE tourist_atractions SET active_tourist_atraction=0 WHERE id_tourist_atraction=:1 ");
$EliminarAtractivo -> bindParam(':1',$idAtractivo);
$EliminarAtractivo -> execute();

$result = $EliminarAtractivo->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
