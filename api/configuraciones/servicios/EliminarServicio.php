<?php

require_once('../../PDO.php');

$idServicio = $_POST['idServicio'];

$EliminarServicio = $conexion -> prepare("UPDATE services_contact_book SET active_service=0 WHERE id_service=:1 ");
$EliminarServicio -> bindParam(':1',$idServicio);
$EliminarServicio -> execute();

$result = $EliminarServicio->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
