<?php

require_once "../PDO.php";

$ObtenerUltimoArqueo = $conexion -> prepare("SELECT * from arqueos left join users ON id_user = idUsuario_arqueo WHERE estado_arqueo=1 ORDER BY fechaHora_arqueo DESC LIMIT 1");
$ObtenerUltimoArqueo -> execute();
$result = $ObtenerUltimoArqueo->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));
?>
