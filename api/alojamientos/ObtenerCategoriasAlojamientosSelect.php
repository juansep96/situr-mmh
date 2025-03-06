<?php

require_once('../PDO.php');

$ObtenerCategorias = $conexion -> query("SELECT * FROM categories_types WHERE active_categories_types=1 ORDER BY name_categories_types ASC ");

$result = $ObtenerCategorias->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>