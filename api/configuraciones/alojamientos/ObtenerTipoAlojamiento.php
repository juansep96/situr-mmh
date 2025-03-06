<?php

require_once('../../PDO.php');

$idTipoAlojamiento = $_POST['idTipoAlojamiento'];

$ObtenerTipoAlojamiento = $conexion -> prepare("SELECT * FROM accomodations_types WHERE id_accomodations_types =:1");
$ObtenerTipoAlojamiento -> bindParam(':1',$idTipoAlojamiento);
$ObtenerTipoAlojamiento -> execute();

$result = $ObtenerTipoAlojamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
