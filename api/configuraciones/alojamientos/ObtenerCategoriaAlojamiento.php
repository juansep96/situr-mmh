<?php

require_once('../../PDO.php');

$idCategoriaAlojamiento = $_POST['idCategoriaAlojamiento'];

$ObtenerCategoriaAlojamiento = $conexion -> prepare("SELECT * FROM categories_types WHERE id_categories_types=:1");
$ObtenerCategoriaAlojamiento -> bindParam(':1',$idCategoriaAlojamiento);
$ObtenerCategoriaAlojamiento -> execute();

$result = $ObtenerCategoriaAlojamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
