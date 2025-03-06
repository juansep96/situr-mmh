<?php

require_once "../PDO.php";

$cuando = date("Y-m-d H:i:s");
$quien = $_SESSION['id_user'];
$turno = date("H");
if($turno > 05 && $turno < 14){
    $turno = "MAÑANA";
}else{
    $turno = "TARDE";
}
$datos = json_decode($_POST['data'],true);
//Insertamos encabezado
$InsertarEncabezado = $conexion -> prepare("INSERT INTO daily_surveys (datetime_daily_survey,last_update_daily_survey,turn_daily_survey,id_user_daily_survey) VALUES(:1,:2,:3,:4)");
$InsertarEncabezado -> bindParam(':1',$cuando);
$InsertarEncabezado -> bindParam(':2',$cuando);
$InsertarEncabezado -> bindParam(':3',$turno);
$InsertarEncabezado -> bindParam(':4',$quien);
$InsertarEncabezado -> execute();
$id_survey = $conexion -> lastInsertId();
//Insertamos Items
foreach($datos as $item){
    $item['id_survey_daily_surveys_item'] = $id_survey;
   $InsertarItem = $conexion -> prepare("INSERT INTO daily_surveys_items (id_survey_daily_surveys_item,id_acomodation_daily_surveys_item,quantity_guest_total_daily_surveys_item,quantity_guest_available_daily_surveys_item,quantity_single_room_daily_surveys_item,quantity_double_room_daily_surveys_item,quantity_triple_room_daily_surveys_item,quantity_quadruple_room_daily_surveys_item,quantity_quintuples_room_daily_surveys_item,quantity_sextuples_room_daily_surveys_item,quantity_septuples_room_daily_surveys_item) VALUES(:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11)");
   $InsertarItem -> bindParam(':1',$item['id_survey_daily_surveys_item']);
   $InsertarItem -> bindParam(':2',$item['id_acomodation_daily_surveys_item']);
   $InsertarItem -> bindParam(':3',$item['quantity_guest_total_daily_surveys_item']);
   $InsertarItem -> bindParam(':4',$item['quantity_guest_available_daily_surveys_item']);
   $InsertarItem -> bindParam(':5',$item['quantity_single_room_daily_surveys_item']);
   $InsertarItem -> bindParam(':6',$item['quantity_double_room_daily_surveys_item']);
   $InsertarItem -> bindParam(':7',$item['quantity_triple_room_daily_surveys_item']);
   $InsertarItem -> bindParam(':8',$item['quantity_quadruple_room_daily_surveys_item']);
   $InsertarItem -> bindParam(':9',$item['quantity_quintuples_room_daily_surveys_item']);
   $InsertarItem -> bindParam(':10',$item['quantity_sextuples_room_daily_surveys_item']);
   $InsertarItem -> bindParam(':11',$item['quantity_septuples_room_daily_surveys_item']);
   if(!$InsertarItem -> execute()){
        echo "\nPDO::errorInfo():\n";
        print_r($InsertarItem->errorInfo());
   }
}
echo "OK";
?>