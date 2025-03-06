<?php

require_once('../PDO.php');

$idAtencion = $_POST['idAtencion'];

$EliminarAtencion = $conexion -> prepare("UPDATE events_surveys SET active_events_survey=0 WHERE id_events_survey=:1");
$EliminarAtencion -> bindParam(':1',$idAtencion);
$EliminarAtencion -> execute();

$result = $EliminarAtencion->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
