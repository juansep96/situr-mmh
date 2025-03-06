<?php

require_once('../PDO.php');

$ObtenerProvincias = $conexion -> query("SELECT * FROM provinces ORDER BY name_province ASC");

$result = $ObtenerProvincias->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>