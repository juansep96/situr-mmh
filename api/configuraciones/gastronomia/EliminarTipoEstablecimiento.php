<?php

require_once('../../PDO.php');

$idTipoEstablecimiento = $_POST['idTipoEstablecimiento'];

$EliminarTipoEstablecimientoGastronomico = $conexion -> prepare("UPDATE gastronomy_types SET active_gastronomy_type=0 WHERE id_gastronomy_type=:1 ");
$EliminarTipoEstablecimientoGastronomico -> bindParam(':1',$idTipoEstablecimiento);
$EliminarTipoEstablecimientoGastronomico -> execute();

$result = $EliminarTipoEstablecimientoGastronomico->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
