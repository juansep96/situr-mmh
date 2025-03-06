<?php

require_once('../../PDO.php');

$idCategoriaAlojamiento = $_POST['idCategoriaAlojamiento'];

$EliminarCategoriaAlojamiento = $conexion -> prepare("UPDATE categories_types SET active_categories_types=0 WHERE id_categories_types=:1 ");
$EliminarCategoriaAlojamiento -> bindParam(':1',$idCategoriaAlojamiento);
$EliminarCategoriaAlojamiento -> execute();

$result = $EliminarCategoriaAlojamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
