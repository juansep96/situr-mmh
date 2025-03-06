<?php

require_once('../PDO.php');

$ObtenerInstituciones = $conexion -> query("SELECT * FROM instituciones WHERE estado_institucion = 1 ORDER BY nombre_institucion ASC");

$result = $ObtenerInstituciones->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>