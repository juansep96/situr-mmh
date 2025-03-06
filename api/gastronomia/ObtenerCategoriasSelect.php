<?php

require_once('../PDO.php');

$ObtenerCategorias = $conexion -> query("SELECT * FROM gastronomy_types WHERE active_gastronomy_type=1 ORDER BY name_gastronomy_type ASC ");

$result = $ObtenerCategorias->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>