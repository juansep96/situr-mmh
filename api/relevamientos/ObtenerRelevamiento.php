<?php

require_once('../PDO.php');

$idRelevamiento = $_POST['idRelevamiento'];

$ObtenerRelevamiento = $conexion -> prepare("SELECT * FROM daily_surveys_items left join accomodations on id_acomodation_daily_surveys_item = id_accomodation left join accomodations_types ON id_accomodations_types = id_type_accomodation LEFT JOIN daily_surveys ON id_daily_survey = id_survey_daily_surveys_item WHERE id_survey_daily_surveys_item =:1");
$ObtenerRelevamiento -> bindParam(':1',$idRelevamiento);
$ObtenerRelevamiento -> execute();

$result = $ObtenerRelevamiento->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
