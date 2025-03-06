<?php

require_once('../../PDO.php');

$idServicio = $_POST['idServicio'];

$ObtenerServicio = $conexion -> prepare("SELECT * FROM services_contact_book WHERE id_service=:1");
$ObtenerServicio -> bindParam(':1',$idServicio);
$ObtenerServicio -> execute();

$result = $ObtenerServicio->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
