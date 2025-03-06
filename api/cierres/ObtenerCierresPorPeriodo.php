<?php

require_once "../PDO.php";

$fechaIni = $_POST['desde'];
$fechaIni = str_replace('T',' ',$fechaIni).':00';
$fechaFin = $_POST['hasta'];
$fechaFin = str_replace('T',' ',$fechaFin).':00';
$ObtenerTotales = $conexion -> prepare("SELECT formaPago_income,SUM(total_income) as 'total' from laguna_incomes WHERE active_income=1 and fechaHora_income BETWEEN :1 AND :2 GROUP BY formaPago_income");
$ObtenerTotales -> bindParam(':1',$fechaIni);
$ObtenerTotales -> bindParam(':2',$fechaFin);
$ObtenerTotales -> execute();

$result = $ObtenerTotales->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));


?>