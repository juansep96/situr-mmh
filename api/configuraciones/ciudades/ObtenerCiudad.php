<?php

require_once('../../PDO.php');

$idCiudad = $_POST['idCiudad'];

$ObtenerCiudad = $conexion -> prepare("SELECT * FROM cities left join provinces on id_province = id_province_city WHERE id_city=:1");
$ObtenerCiudad -> bindParam(':1',$idCiudad);
$ObtenerCiudad -> execute();

$result = $ObtenerCiudad->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
