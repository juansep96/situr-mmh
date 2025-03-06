<?php

require_once('../PDO.php');

$ObtenerAlojamientos = $conexion -> query("SELECT * FROM accomodations left join accomodations_types ON id_accomodations_types = id_type_accomodation WHERE active_accomodation=1 ORDER BY id_type_accomodation ASC");

$result = $ObtenerAlojamientos->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>