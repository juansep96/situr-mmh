<?php

require_once('../PDO.php');

$ObtenerTiposAlojamientos = $conexion -> query("SELECT * FROM accomodations_types WHERE active_accomodations_types=1 ORDER BY name_accomodations_types ASC ");

$result = $ObtenerTiposAlojamientos->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>