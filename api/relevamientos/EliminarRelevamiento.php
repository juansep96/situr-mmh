<?php

require_once('../PDO.php');

$idRelevamiento = $_POST['idRelevamiento'];

$EliminarRelevamiento = $conexion -> prepare("UPDATE daily_surveys SET active_daily_survey=0 WHERE id_daily_survey=:1");
$EliminarRelevamiento -> bindParam(':1',$idRelevamiento);
$EliminarRelevamiento -> execute();

$result = $EliminarRelevamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
