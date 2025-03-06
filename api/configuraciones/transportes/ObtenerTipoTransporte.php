<?php

require_once('../../PDO.php');

$idTipoTransporte = $_POST['idTipoTransporte'];

$ObtenerTipoTransporte = $conexion -> prepare("SELECT * FROM transportations_types WHERE id_transportations_type=:1");
$ObtenerTipoTransporte -> bindParam(':1',$idTipoTransporte);
$ObtenerTipoTransporte -> execute();

$result = $ObtenerTipoTransporte->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
