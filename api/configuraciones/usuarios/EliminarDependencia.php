<?php

require_once('../../PDO.php');

$idDependencia = $_POST['idDependencia'];

$EliminarDependencia = $conexion -> prepare("UPDATE dependences SET active_dependence=0 WHERE id_dependence=:1 ");
$EliminarDependencia -> bindParam(':1',$idDependencia);
$EliminarDependencia -> execute();

$result = $EliminarDependencia->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
