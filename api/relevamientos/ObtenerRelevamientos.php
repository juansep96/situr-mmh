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
    $searchQuery = " AND (turn_daily_survey LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM daily_surveys LEFT JOIN users on id_user = id_user_daily_survey WHERE (datetime_daily_survey BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_daily_survey=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM daily_surveys LEFT JOIN users on id_user = id_user_daily_survey WHERE 1 ".$searchQuery ." AND (datetime_daily_survey BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_daily_survey=1");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM daily_surveys LEFT JOIN users on id_user = id_user_daily_survey WHERE 1 ".$searchQuery ." AND (datetime_daily_survey BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_daily_survey=1 ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
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
  $idRelevamiento = $row['id_daily_survey'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  $acciones = $acciones. '<a href="javascript:;" onclick="VerRelevamiento('.$idRelevamiento.')" class="text-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Ver info" aria-label="Ver"><i class="bi bi-eye"></i></a>';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones. '<a href="javascript:;" onclick="EditarRelevamiento('.$idRelevamiento.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a>';
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarRelevamiento('.$idRelevamiento.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  //Ahora tenemos que obtener los items para saber la disponibilidad
  $ObtenerItems = $conexion -> prepare("SELECT quantity_guest_total_daily_surveys_item,quantity_guest_available_daily_surveys_item FROM daily_surveys_items WHERE id_survey_daily_surveys_item=:1");
  $ObtenerItems -> bindParam(':1',$idRelevamiento);
  $ObtenerItems -> execute();
  $available = 0;
  $cantidad = $ObtenerItems->RowCount();
  foreach($ObtenerItems as $Item){
    $plazas_disponibles = intval($Item['quantity_guest_available_daily_surveys_item']);
    $plazas_totales = intval($Item['quantity_guest_total_daily_surveys_item']);
    $porcentaje_disponibilidad = ($plazas_disponibles / $plazas_totales);
    $available = $available + $porcentaje_disponibilidad;
  }
  $available = (floatval($available) / $cantidad) * 100;
  $available = number_format($available,2,'.','');
  $acciones = $acciones.'</div>';
   $data[] = array(
      "datetime_daily_survey"=>date('H:i',strtotime($row['datetime_daily_survey'])),
      "turn_daily_survey"=>strtoupper($row['turn_daily_survey']),
      "available_daily_survey"=>$available." %",
      "last_update_daily_survey"=>date('H:i',strtotime($row['last_update_daily_survey'])),
      "details_daily_survey"=>strtoupper($row['details_daily_survey']),
      "lastname_user" => strtoupper($row['last_name_user'] . " ".$row['first_name_user']),
      "acciones_daily_survey"=>$acciones,
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