<?php

require_once('../PDO.php');

$tipo = $_POST['tipo'];


$ObtenerPrecios = $conexion -> prepare("SELECT * FROM laguna_prices WHERE estado_price = 1");
$ObtenerPrecios -> execute();

$prices = [];

if($tipo  == 'RESIDENTE'){
    foreach($ObtenerPrecios as $pr){
        $data = [
            "nombre" =>  $pr['nombrePrecio_price'],
            "precio" => $pr['precioResidente_price'],
        ];
        array_push($prices,$data);
    }
}else{
    foreach($ObtenerPrecios as $pr){
        $data = [
            "nombre" =>  $pr['nombrePrecio_price'],
            "precio" => $pr['precioTurista_price'],
        ];
        array_push($prices,$data);
    }
}


print_r (json_encode($prices));

?>
