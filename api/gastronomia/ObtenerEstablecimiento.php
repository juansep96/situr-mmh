<?php

require_once('../PDO.php');

$idEstablecimiento = $_POST['idEstablecimiento'];

$ObtenerEstablecimientos = $conexion -> prepare("SELECT * FROM gastronomy LEFT JOIN gastronomy_types on id_gastronomy_type  = id_type_gastronomy WHERE id_gastronomy =:1");
$ObtenerEstablecimientos -> bindParam(':1',$idEstablecimiento);
$ObtenerEstablecimientos -> execute();

foreach($ObtenerEstablecimientos as $row){
    $servicios = str_replace("[","",$row['ids_services_gastronomy']);
    $servicios = str_replace("]","",$servicios);
    $servicios = explode(',',$servicios);
    $serviciosfinal = [];
    foreach($servicios as $servicio){
      $idServicio = str_replace('"','',$servicio);
      $ObtenerServicio = $conexion -> prepare("SELECT * from services WHERE id_service=:1");
      $ObtenerServicio -> bindParam(':1',$idServicio);
      $ObtenerServicio -> execute();
      foreach($ObtenerServicio as $servicioDetallado){
          $obj = [$servicioDetallado['id_service'],$servicioDetallado['name_service']];
          array_push($serviciosfinal,$obj);
      }
    }
    $data[] = array(
        "id_gastronomy"=>$row['id_gastronomy'],
        "name_gastronomy"=>strtoupper($row['name_gastronomy']),
        "phone_gastronomy"=>$row['phone_gastronomy'],
        "address_gastronomy"=>strtoupper($row['address_gastronomy']),
        "email_gastronomy"=>$row['email_gastronomy'],
        "name_gastronomy_type" => strtoupper($row['name_gastronomy_type']),
        "id_type_gastronomy" => $row['id_type_gastronomy'],
        "quantity_guests_gastronomy"=>$row['quantity_guests_gastronomy'],
        "details_gastronomy"=>strtoupper($row['details_gastronomy']),
        "services_gastronomy"=>json_encode($serviciosfinal),
     );
}

print_r (json_encode($data));

?>
