<?php

require_once('../PDO.php');

$idCierre = $_POST['idCierre'];

$EliminarCierre = $conexion -> prepare("UPDATE arqueos SET estado_arqueo=0 WHERE id_arqueo=:1 ");
$EliminarCierre -> bindParam(':1',$idCierre);
$EliminarCierre -> execute();

$result = $EliminarCierre->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
