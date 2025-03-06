<?php

require_once('../../PDO.php');

$idTipoTransporte = $_POST['idTipoTransporte'];

$EliminarTipoTransporte = $conexion -> prepare("UPDATE transportations_types SET active_transportations_type=0 WHERE id_transportations_type=:1 ");
$EliminarTipoTransporte -> bindParam(':1',$idTipoTransporte);
$EliminarTipoTransporte -> execute();

$result = $EliminarTipoTransporte->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
