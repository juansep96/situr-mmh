<?php

require_once('../PDO.php');

$conn=$conexion;
$fechaDesde = $_GET['fechaDesde']." 00:00:00";
$fechaHasta = $_GET['fechaHasta']." 23:59:59";

//Solo validar Informes Terminal
$idDependencia = 8;

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
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM tourist_attentions LEFT JOIN users on id_user = id_user_tourist_attention left join cities on id_city = id_origin_tourist_attention LEFT JOIN provinces ON id_province = id_province_city  WHERE (date_tourist_attentions BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_tourist_attention=1 AND id_dependence_user = '$idDependencia'");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM tourist_attentions LEFT JOIN users on id_user = id_user_tourist_attention left join cities on id_city = id_origin_tourist_attention LEFT JOIN provinces ON id_province = id_province_city  WHERE 1 ".$searchQuery ." AND (date_tourist_attentions BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_tourist_attention=1 AND id_dependence_user = '$idDependencia'");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM tourist_attentions LEFT JOIN users on id_user = id_user_tourist_attention  left join cities on id_city = id_origin_tourist_attention LEFT JOIN provinces ON id_province = id_province_city  WHERE 1 ".$searchQuery ." AND (date_tourist_attentions BETWEEN '$fechaDesde' AND '$fechaHasta') AND active_tourist_attention=1 AND id_dependence_user = '$idDependencia' ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
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
  $idAtencion = $row['id_tourist_attention'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarAtencion('.$idAtencion.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  $acciones = $acciones.'</div>';
  
  if($row['pais_attention'] == 'ARGENTINA'){
    $provincia = strtoupper($row['name_province']);
    $ciudad = strtoupper($row['name_city']);
  }else{
    $provincia = '';
    $ciudad = '';
  }

  
   $data[] = array(
      "date_tourist_attentions"=>date('H:i',strtotime($row['date_tourist_attentions'])),
      "id_user_tourist_attention"=>strtoupper($row['last_name_user'] . " ".$row['first_name_user']),
      "quantity_people_tourist_attention"=>$row['quantity_people_tourist_attention'],
      "pais_attention"=>strtoupper($row['pais_attention']),
      "name_province"=>$provincia,
      "id_origin_tourist_attention"=>$ciudad,
      "details_tourist_attentions"=>strtoupper($row['details_tourist_attentions']),
      "acciones_tourist_attentions"=>$acciones,
      "motivo_attention"=>strtoupper($row['nombre_motivo']),

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