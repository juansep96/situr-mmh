<?php

require_once('../../PDO.php');

$idTipoEstablecimiento = $_POST['idTipoEstablecimiento'];

$ObtenerTipoEstablecimiento = $conexion -> prepare("SELECT * FROM gastronomy_types WHERE id_gastronomy_type=:1");
$ObtenerTipoEstablecimiento -> bindParam(':1',$idTipoEstablecimiento);
$ObtenerTipoEstablecimiento -> execute();

$result = $ObtenerTipoEstablecimiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
