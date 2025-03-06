<?php

require_once('../../PDO.php');

$idInstitucion = $_POST['idInstitucion'];

$ObtenerInstitucion = $conexion -> prepare("SELECT * FROM instituciones WHERE id_institucion=:1");
$ObtenerInstitucion -> bindParam(':1',$idInstitucion);
$ObtenerInstitucion -> execute();

$result = $ObtenerInstitucion->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
