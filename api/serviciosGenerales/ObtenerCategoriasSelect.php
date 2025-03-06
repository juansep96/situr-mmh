<?php

require_once('../PDO.php');

$ObtenerServicios = $conexion -> query("SELECT * FROM services_contact_book WHERE active_service=1 ORDER BY name_service ASC ");

$result = $ObtenerServicios->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>