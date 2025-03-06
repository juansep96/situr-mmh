<?php

require_once('../../PDO.php');

$idDependencia = $_POST['idDependencia'];

$ObtenerDependencia = $conexion -> prepare("SELECT * FROM dependences WHERE id_dependence=:1");
$ObtenerDependencia -> bindParam(':1',$idDependencia);
$ObtenerDependencia -> execute();

$result = $ObtenerDependencia->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
