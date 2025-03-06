<?php

require_once('../../PDO.php');

$idMotivo = $_POST['idMotivo'];

$ObtenerMotivo = $conexion -> prepare("SELECT * FROM motivosConsulta WHERE estado_motivo =1 AND id_motivo=:1");
$ObtenerMotivo -> bindParam(':1',$idMotivo);
$ObtenerMotivo -> execute();

$result = $ObtenerMotivo->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
