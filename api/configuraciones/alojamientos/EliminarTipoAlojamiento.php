<?php

require_once('../../PDO.php');

$idTipoAlojamiento = $_POST['idTipoAlojamiento'];

$EliminarTipoAlojamiento = $conexion -> prepare("UPDATE accomodations_types SET active_accomodations_types=0 WHERE id_accomodations_types =:1 ");
$EliminarTipoAlojamiento -> bindParam(':1',$idTipoAlojamiento);
$EliminarTipoAlojamiento -> execute();

$result = $EliminarTipoAlojamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
