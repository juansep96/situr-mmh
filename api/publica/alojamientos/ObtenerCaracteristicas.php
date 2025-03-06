<?php

require_once('../../PDO.php');

$ObtenerServicios = $conexion -> query("SELECT id_amenetie,name_amenetie FROM ameneties WHERE active_amenetie = 1 ORDER BY name_amenetie ASC");

$result = $ObtenerServicios->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>