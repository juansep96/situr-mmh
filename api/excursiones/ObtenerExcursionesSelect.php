<?php

require_once('../PDO.php');

$ObtenerActividades = $conexion -> query("SELECT * FROM excursions WHERE active_activity=1 ORDER BY name_activity ASC ");

$result = $ObtenerActividades->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>