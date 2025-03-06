<?php

require_once('../../PDO.php');

$idServicioEstablecimiento = $_POST['idServicioEstablecimiento'];

$ObtenerServicioEstablecimiento = $conexion -> prepare("SELECT * FROM services WHERE id_service=:1");
$ObtenerServicioEstablecimiento -> bindParam(':1',$idServicioEstablecimiento);
$ObtenerServicioEstablecimiento -> execute();

$result = $ObtenerServicioEstablecimiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
