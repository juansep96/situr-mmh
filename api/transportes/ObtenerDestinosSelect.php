<?php

require_once('../PDO.php');

$ObtenerDestinos = $conexion -> query("SELECT * FROM cities WHERE active_city=1 ORDER BY name_city ASC ");

$result = $ObtenerDestinos->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>