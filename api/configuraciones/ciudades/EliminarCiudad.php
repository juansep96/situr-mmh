<?php

require_once('../../PDO.php');

$idCiudad = $_POST['idCiudad'];

$EliminarCiudad = $conexion -> prepare("UPDATE cities SET active_city=0 WHERE id_city=:1 ");
$EliminarCiudad -> bindParam(':1',$idCiudad);
$EliminarCiudad -> execute();

$result = $EliminarCiudad->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
