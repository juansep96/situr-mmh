<?php

require_once('../PDO.php');

$idVisita = $_POST['idVisita'];

$ObtenerVisita = $conexion -> prepare("SELECT * FROM museoHistorico_visitas WHERE id_visita=:1");
$ObtenerVisita -> bindParam(':1',$idVisita);
$ObtenerVisita -> execute();

$result = $ObtenerVisita->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
