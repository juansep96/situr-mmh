<?php

require_once('../../PDO.php');

$idMotivo = $_POST['idMotivo'];

$EliminarMotivo = $conexion -> prepare("UPDATE motivosConsulta SET estado_motivo=0 WHERE id_motivo =:1 ");
$EliminarMotivo -> bindParam(':1',$idMotivo);
$EliminarMotivo -> execute();

$result = $EliminarMotivo->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
