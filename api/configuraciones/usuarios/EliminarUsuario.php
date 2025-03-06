<?php

require_once('../../PDO.php');

$idUsuario = $_POST['idUsuario'];

$EliminarUsuario = $conexion -> prepare("UPDATE users SET active_user=0 WHERE id_user=:1 ");
$EliminarUsuario -> bindParam(':1',$idUsuario);
$EliminarUsuario -> execute();

$result = $EliminarUsuario->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
