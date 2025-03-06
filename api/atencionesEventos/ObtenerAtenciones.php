<?php

require_once('../PDO.php');

$conn=$conexion;
$fechaDesde = $_GET['fechaDesde']." 00:00:00";
$fechaHasta = $_GET['fechaHasta']." 23:59:59";

## Read value
$draw = $_POST['draw'];
$row = $_POST['start'];
$rowperpage = $_POST['length']; // Rows display per page
$columnIndex = $_POST['order'][0]['column']; // Column index
$columnName = $_POST['columns'][$columnIndex]['data']; // Column name
$columnSortOrder = $_POST['order'][0]['dir']; // asc or desc
$searchValue = $_POST['search']['value']; // Search value

$searchArray = array();

## Search
$searchQuery = " ";
if($searchValue != ''){
    $searchQuery = " AND (name_city LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM events_surveys LEFT JOIN users on id_user = id_user_events_survey left join cities on id_city = id_origin_events_survey LEFT JOIN provinces ON id_province = id_province_city  LEFT JOIN progr_activities ON id_activity_events_survey = id_activity  WHERE (date_events_survey BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_events_survey=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM events_surveys LEFT JOIN users on id_user = id_user_events_survey left join cities on id_city = id_origin_events_survey LEFT JOIN provinces ON id_province = id_province_city  LEFT JOIN progr_activities ON id_activity_events_survey = id_activity  WHERE 1 ".$searchQuery ." AND (date_events_survey BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_events_survey=1");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM events_surveys LEFT JOIN users on id_user = id_user_events_survey left join cities on id_city = id_origin_events_survey LEFT JOIN provinces ON id_province = id_province_city  LEFT JOIN progr_activities ON id_activity_events_survey = id_activity  WHERE 1 ".$searchQuery ." AND (date_events_survey BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_events_survey=1 ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
// Bind values
foreach($searchArray as $key=>$search){
   $stmt->bindValue(':'.$key, $search,PDO::PARAM_STR);
}

$stmt->bindValue(':limit', (int)$row, PDO::PARAM_INT);
$stmt->bindValue(':offset', (int)$rowperpage, PDO::PARAM_INT);

if($stmt->execute()){
    $empRecords = $stmt->fetchAll();
}else{
    echo "\nPDO::errorInfo():\n";
    print_r($stmt->errorInfo());
}

$data = array();


foreach($empRecords as $row){
  $idAtencion = $row['id_events_survey'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarAtencion('.$idAtencion.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  $acciones = $acciones.'</div>';

  if($row['pais_events_surveys'] == 'ARGENTINA'){
    $provincia = strtoupper($row['name_province']);
    $ciudad = strtoupper($row['name_city']);
  }else{
    $provincia = '';
    $ciudad = '';
  }



   $data[] = array(
      "date_events_survey"=>date('H:i',strtotime($row['date_events_survey'])),
      "name_activity"=>strtoupper($row['name_activity']),
      "id_user_events_survey"=>strtoupper($row['last_name_user'] . " ".$row['first_name_user']),
      "quantity_people_events_survey"=>$row['quantity_people_events_survey'],
      "quantity_days_events_survey"=>strtoupper($row['quantity_days_events_survey']),
      "daily_amount_events_survey"=>'$ '.number_format(floatval($row['daily_amount_events_survey']),2,'.'),
      "pais_events_surveys"=>strtoupper($row['pais_events_surveys']),
      "name_province"=>$provincia,
      "name_city"=>$ciudad,
      "details_events_survey"=>strtoupper($row['details_events_survey']),
      "acciones_events_survey"=>$acciones
   );
}

## Response
$response = array(
   "draw" => intval($draw),
   "iTotalRecords" => $totalRecords,
   "iTotalDisplayRecords" => $totalRecordwithFilter,
   "aaData" => $data
);

echo json_encode($response);



?>