<?php

require_once('../PDO.php');

$ObtenerMotivos = $conexion -> query("SELECT * FROM motivosConsulta WHERE estado_motivo = 1 ORDER BY nombre_motivo ASC");

$result = $ObtenerMotivos->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>