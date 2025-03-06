<?php

require_once('../PDO.php');

$idProfesional = $_POST['idProfesional'];

$EliminarProfesional = $conexion -> prepare("UPDATE contact_book SET active_contact=0 WHERE id_contact =:1 ");
$EliminarProfesional -> bindParam(':1',$idProfesional);
$EliminarProfesional -> execute();

$result = $EliminarProfesional->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
