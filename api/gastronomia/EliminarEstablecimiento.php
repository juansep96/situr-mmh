<?php

require_once('../PDO.php');

$idEstablecimiento = $_POST['idEstablecimiento'];

$EliminarEstablecimiento = $conexion -> prepare("UPDATE gastronomy SET active_gastronomy=0 WHERE id_gastronomy =:1 ");
$EliminarEstablecimiento -> bindParam(':1',$idEstablecimiento);
$EliminarEstablecimiento -> execute();

$result = $EliminarEstablecimiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
