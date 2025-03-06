<?php

require_once('../PDO.php');

$idAtencion = $_POST['idAtencion'];

$EliminarAtencion = $conexion -> prepare("UPDATE tourist_attentions SET active_tourist_attention=0 WHERE id_tourist_attention=:1");
$EliminarAtencion -> bindParam(':1',$idAtencion);
$EliminarAtencion -> execute();

$result = $EliminarAtencion->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
