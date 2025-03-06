<?php

require_once('../../PDO.php');

$data = $_POST['roomSize'];

switch($data){
    case 1:
        $field = "quantity_single_room_daily_surveys_item";
    break;
    case 2:
        $field = 'quantity_double_room_daily_surveys_item';
    break;
    case 3:
        $field = 'quantity_triple_room_daily_surveys_item';
    break;
    case 4:
        $field = 'quantity_quadruple_room_daily_surveys_item';
    break;
}


if(isset($_POST['roomSize'])){
    $ObtenerAlojamientos = $conexion -> query("SELECT name_accomodation,phone_accomodation,address_accomodation,name_accomodations_types,name_categories_types,last_update_daily_survey FROM daily_surveys left join daily_surveys_items on id_survey_daily_surveys_item = id_daily_survey left join accomodations on id_accomodation = id_acomodation_daily_surveys_item left join accomodations_types on id_accomodations_types = id_type_accomodation left join categories_types on id_categories_types = id_type_category_accomodation WHERE ".$field." > 0 AND active_accomodation = 1 AND active_daily_survey = 1 ORDER BY last_update_daily_survey DESC LIMIT 1");
    
    $result = $ObtenerAlojamientos->fetchAll(\PDO::FETCH_ASSOC);
    
    print_r (json_encode($result));
}


?>