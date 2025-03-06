<?php

require_once('../PDO.php');

$idActividad = $_POST['idActividad'];

$ObtenerActividad = $conexion -> prepare("SELECT * FROM progr_activities WHERE id_activity=:1");
$ObtenerActividad -> bindParam(':1',$idActividad);
$ObtenerActividad -> execute();

$result = $ObtenerActividad->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
