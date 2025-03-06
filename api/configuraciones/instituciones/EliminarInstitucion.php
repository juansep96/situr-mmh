<?php

require_once('../../PDO.php');

$idInstitucion = $_POST['idInstitucion'];

$EliminarInstitucion = $conexion -> prepare("UPDATE instituciones SET estado_institucion=0 WHERE id_institucion=:1 ");
$EliminarInstitucion -> bindParam(':1',$idInstitucion);
$EliminarInstitucion -> execute();

$result = $EliminarInstitucion->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
