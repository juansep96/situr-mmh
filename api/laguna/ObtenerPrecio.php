<?php

require_once('../PDO.php');

$idPrecio = $_POST['idPrecio'];

$ObtenerPrecio = $conexion -> prepare("SELECT * FROM laguna_prices WHERE id_price=:1");
$ObtenerPrecio -> bindParam(':1',$idPrecio);
$ObtenerPrecio -> execute();

$result = $ObtenerPrecio->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
