<?php

require_once('../PDO.php');

$ObtenerPaises = $conexion -> query("SELECT * FROM paises ORDER BY nombre ASC");

$result = $ObtenerPaises->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>