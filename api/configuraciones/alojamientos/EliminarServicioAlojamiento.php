<?php

require_once('../../PDO.php');

$idServicioAlojamiento = $_POST['idServicioAlojamiento'];

$EliminarServicioAlojamiento = $conexion -> prepare("UPDATE ameneties SET active_amenetie=0 WHERE id_amenetie =:1 ");
$EliminarServicioAlojamiento -> bindParam(':1',$idServicioAlojamiento);
$EliminarServicioAlojamiento -> execute();

$result = $EliminarServicioAlojamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
