<?php

require_once('../../PDO.php');

$ObtenerTransportes = $conexion -> query("SELECT name_transportation,phone_transportation,address_transportation,name_transportations_type FROM transportations left join transportations_types on id_transportations_type = id_type_transportation WHERE active_transportation = 1 ORDER BY name_transportation ASC");

$result = $ObtenerTransportes->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>