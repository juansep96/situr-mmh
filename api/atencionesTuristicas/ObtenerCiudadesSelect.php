<?php

require_once('../PDO.php');

$idProvincia = $_POST['idProvincia'];

$ObtenerProvincias = $conexion -> prepare("SELECT * FROM cities WHERE id_province_city =:1 ORDER BY name_city ASC");
$ObtenerProvincias -> bindParam(':1',$idProvincia);
$ObtenerProvincias -> execute();

$result = $ObtenerProvincias->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>