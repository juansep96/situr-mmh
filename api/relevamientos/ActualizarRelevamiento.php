<?php

require_once "../PDO.php";

$cuando = date("Y-m-d H:i:s");
$quien = $_SESSION['id_user'];

$datos = json_decode($_POST['data'],true);
//Actualizamos los items
foreach($datos as $item){
   $ActualizarItem = $conexion -> prepare("UPDATE daily_surveys_items SET id_survey_daily_surveys_item=:1,id_acomodation_daily_surveys_item=:2,quantity_guest_total_daily_surveys_item=:3,quantity_guest_available_daily_surveys_item=:4,quantity_single_room_daily_surveys_item=:5,quantity_double_room_daily_surveys_item=:6,quantity_triple_room_daily_surveys_item=:7,quantity_quadruple_room_daily_surveys_item=:8,quantity_quintuples_room_daily_surveys_item=:10,quantity_sextuples_room_daily_surveys_item=:11,quantity_septuples_room_daily_surveys_item=:12 WHERE id_daily_surveys_item=:9");
   $ActualizarItem -> bindParam(':1',$item['id_survey_daily_surveys_item']);
   $ActualizarItem -> bindParam(':2',$item['id_acomodation_daily_surveys_item']);
   $ActualizarItem -> bindParam(':3',$item['quantity_guest_total_daily_surveys_item']);
   $ActualizarItem -> bindParam(':4',$item['quantity_guest_available_daily_surveys_item']);
   $ActualizarItem -> bindParam(':5',$item['quantity_single_room_daily_surveys_item']);
   $ActualizarItem -> bindParam(':6',$item['quantity_double_room_daily_surveys_item']);
   $ActualizarItem -> bindParam(':7',$item['quantity_triple_room_daily_surveys_item']);
   $ActualizarItem -> bindParam(':8',$item['quantity_quadruple_room_daily_surveys_item']);
   $ActualizarItem -> bindParam(':9',$item['id_daily_surveys_item']);
   $ActualizarItem -> bindParam(':10',$item['quantity_quintuples_room_daily_surveys_item']);
   $ActualizarItem -> bindParam(':11',$item['quantity_sextuples_room_daily_surveys_item']);
   $ActualizarItem -> bindParam(':12',$item['quantity_septuples_room_daily_surveys_item']);

   if(!$ActualizarItem -> execute()){
        echo "\nPDO::errorInfo():\n";
        print_r($ActualizarItem->errorInfo());
   }
   $id_daily_survey = $item['id_survey_daily_surveys_item'];
}
//Ahora tenemos que actualizar la ultima actualizacion de la cabecera
$ActualizarCabecera = $conexion -> prepare ("UPDATE daily_surveys SET last_update_daily_survey=:1 WHERE id_daily_survey =:2");
$ActualizarCabecera -> bindParam(':1',$cuando);
$ActualizarCabecera -> bindParam(':2',$id_daily_survey);
if(!$ActualizarCabecera -> execute()){
    echo "\nPDO::errorInfo():\n";
    print_r($ActualizarCabecera->errorInfo());
}else{
    echo "OK";
}
?>