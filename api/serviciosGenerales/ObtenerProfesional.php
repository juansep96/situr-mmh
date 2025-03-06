<?php

require_once('../PDO.php');

$idProfesional = $_POST['idProfesional'];

$ObtenerProfesional = $conexion -> prepare("SELECT * FROM contact_book WHERE id_contact =:1");
$ObtenerProfesional -> bindParam(':1',$idProfesional);
$ObtenerProfesional -> execute();


$result = $ObtenerProfesional->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
