<?php

require_once "../PDO.php";

//Mi fecha INI tiene que ser la fechaHora en la que se cerro el ultimo arqueo

$ObtenerUltimoArqueo = $conexion -> query("SELECT * from arqueos WHERE estado_arqueo=1 ORDER BY id_arqueo DESC LIMIT 1");
foreach($ObtenerUltimoArqueo as $ultimo){
    $fechaIni = $ultimo['fechaHora_arqueo'];
}

$fechaFin = date("Y-m-d H:i:s");


$ObtenerTotales = $conexion -> prepare("SELECT formaPago_income,SUM(total_income) as 'total' from laguna_incomes WHERE active_income=1 and fechaHora_income BETWEEN :1 AND :2 GROUP BY formaPago_income");
$ObtenerTotales -> bindParam(':1',$fechaIni);
$ObtenerTotales -> bindParam(':2',$fechaFin);
$ObtenerTotales -> execute();

$result = $ObtenerTotales->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));


?>