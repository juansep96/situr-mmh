<?php

require_once('../../PDO.php');

$idUsuario = $_POST['idUsuario'];

$ObtenerUsuario = $conexion -> prepare("SELECT * FROM users left join dependences on id_dependence = id_dependence_user left join roles on id_type_user = id_role WHERE id_user=:1");
$ObtenerUsuario -> bindParam(':1',$idUsuario);
$ObtenerUsuario -> execute();

$result = $ObtenerUsuario->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
