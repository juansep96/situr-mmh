<?php

require_once('../PDO.php');

$idRC = $_POST['idRC'];

$ObtenerRC = $conexion -> prepare("SELECT * FROM laguna_respCivil left join cities ON idCiudad_respCivil = id_city left join provinces on id_province_city = id_province WHERE id_respCivil =:1");
$ObtenerRC -> bindParam(':1',$idRC);
$ObtenerRC -> execute();

$result = $ObtenerRC->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
