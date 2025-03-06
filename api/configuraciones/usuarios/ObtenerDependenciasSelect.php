<?php

require_once('../../PDO.php');

$ObtenerDependencias = $conexion -> query("SELECT * FROM dependences WHERE active_dependence=1 ORDER BY name_dependence ASC ");

$result = $ObtenerDependencias->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>