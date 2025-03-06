<?php

require_once('../PDO.php');

$ObtenerTipoTransportes = $conexion -> query("SELECT * FROM transportations_types WHERE active_transportations_type=1 ORDER BY name_transportations_type ASC");

$result = $ObtenerTipoTransportes->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>