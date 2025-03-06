<?php

require_once('../PDO.php');

$idTelefono = $_POST['idTelefono'];

$ObtenerTelefono = $conexion -> prepare("SELECT * FROM telefonosUtiles WHERE id_tel =:1");
$ObtenerTelefono -> bindParam(':1',$idTelefono);
$ObtenerTelefono -> execute();

$result = $ObtenerTelefono->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
