<?php

require_once('../PDO.php');

$idTransporte = $_POST['idTransporte'];

$EliminarTransporte = $conexion -> prepare("UPDATE transportations SET active_transportation=0 WHERE id_transportation =:1 ");
$EliminarTransporte -> bindParam(':1',$idTransporte);
$EliminarTransporte -> execute();

$result = $EliminarTransporte->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
