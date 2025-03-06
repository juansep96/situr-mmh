<?php

require_once('../PDO.php');

$idTransporte = $_POST['idTransporte'];

$ObtenerTransporte = $conexion -> prepare("SELECT * FROM transportations LEFT JOIN transportations_types on id_transportations_type  = id_type_transportation WHERE id_transportation =:1");
$ObtenerTransporte -> bindParam(':1',$idTransporte);
$ObtenerTransporte -> execute();

foreach($ObtenerTransporte as $row){
    $destinos = str_replace("[","",$row['ids_destines_transportation']);
    $destinos = str_replace("]","",$destinos);
    $destinos = explode(',',$destinos);
    $destinosAMostrar = '';
    foreach($destinos as $destino){
      $idCiudad = str_replace('"','',$destino);
      $ObtenerDestino = $conexion -> prepare("SELECT name_city from cities WHERE id_city=:1");
      $ObtenerDestino -> bindParam(':1',$idCiudad);
      $ObtenerDestino -> execute();
      foreach($ObtenerDestino as $DestinoDetallado){
          $destinoTexto = $DestinoDetallado['name_city'];
          if($destinosAMostrar == ''){
              $destinosAMostrar = $destinosAMostrar . $destinoTexto;
          }else{
              $destinosAMostrar = $destinosAMostrar ." - ". $destinoTexto;
          }
      }
    }
    $data[] = array(
        "id_transportation"=>$row['id_transportation'],
        "name_transportation"=>strtoupper($row['name_transportation']),
        "address_transportation"=>strtoupper($row['address_transportation']),
        "phone_transportation"=>$row['phone_transportation'],
        "name_transportations_type"=>$row['name_transportations_type'],
        "id_transportations_type"=>$row['id_transportations_type'],
        "details_transportation"=>strtoupper($row['details_transportation']),
        "ids_destines_transportation"=>$row['ids_destines_transportation'],
        "tarif_transportation"=>$row['tarif_transportation'],
        "horarios_transportation"=>$row['horarios_transportation'],
        "horarioAtencion_transportation"=>$row['horarioAtencion_transportation'],
        "redes_transportation"=>$row['redes_transportation'],

        "destinos" =>strtoupper($destinosAMostrar),
     );
}

print_r (json_encode($data));

?>
