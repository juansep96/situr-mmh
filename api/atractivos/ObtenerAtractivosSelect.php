<?php

require_once('../PDO.php');

$ObtenerAtractivos = $conexion -> query("SELECT * FROM tourist_atractions WHERE active_tourist_atraction=1 ORDER BY name_tourist_atraction ASC ");

$result = $ObtenerAtractivos->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>