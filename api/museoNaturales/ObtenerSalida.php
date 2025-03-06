<?php

require_once('../PDO.php');

$idSalida = $_POST['idSalida'];

$ObtenerSalida = $conexion -> prepare("SELECT * FROM museoNaturales_salidas WHERE id_salida=:1");
$ObtenerSalida -> bindParam(':1',$idSalida);
$ObtenerSalida -> execute();

$result = $ObtenerSalida->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
