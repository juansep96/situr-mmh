<?php

require_once('../PDO.php');

$fecha_actual = date("d-m-Y");
//rest 1 semana
$fecha_inicio = date("Y-m-d",strtotime($fecha_actual."- 1 week")) . " 00:00:00"; 
//sum 1 semana
$fecha_fin = date("Y-m-d",strtotime($fecha_actual."+ 1 week")) . " 23:59:59"; 

$ObtenerActividades = $conexion -> prepare("SELECT * FROM progr_activities WHERE active_activity=1 ORDER BY name_activity ASC");
$ObtenerActividades -> execute();

$result = $ObtenerActividades->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>