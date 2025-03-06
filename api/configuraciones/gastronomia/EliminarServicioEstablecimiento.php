<?php

require_once('../../PDO.php');

$idServicioEstablecimiento = $_POST['idServicioEstablecimiento'];

$EliminarServicioEstablecimientoGastronomico = $conexion -> prepare("UPDATE services SET active_service=0 WHERE id_service=:1 ");
$EliminarServicioEstablecimientoGastronomico -> bindParam(':1',$idServicioEstablecimiento);
$EliminarServicioEstablecimientoGastronomico -> execute();

$result = $EliminarServicioEstablecimientoGastronomico->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
