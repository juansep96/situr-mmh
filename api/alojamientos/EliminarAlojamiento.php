<?php

require_once('../PDO.php');

$idAlojamiento = $_POST['idAlojamiento'];

$EliminarAlojamiento = $conexion -> prepare("UPDATE accomodations SET active_accomodation=0 WHERE id_accomodation =:1 ");
$EliminarAlojamiento -> bindParam(':1',$idAlojamiento);
$EliminarAlojamiento -> execute();

$result = $EliminarAlojamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
