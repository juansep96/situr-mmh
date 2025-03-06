<?php

require_once('../../PDO.php');

$idServicioAlojamiento = $_POST['idServicioAlojamiento'];

$ObtenerServicioAlojamiento = $conexion -> prepare("SELECT * FROM ameneties WHERE id_amenetie =:1");
$ObtenerServicioAlojamiento -> bindParam(':1',$idServicioAlojamiento);
$ObtenerServicioAlojamiento -> execute();

$result = $ObtenerServicioAlojamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
