<?php

require_once('../PDO.php');
$fechaInicio = $_GET['desde'].' 00:00:00';
$fechaFin = $_GET['hasta'].' 23:59:59';
$conn=$conexion;


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
    $searchQuery = " AND (id_income LIKE :name ) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM laguna_incomes  WHERE active_income=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM laguna_incomes WHERE 1 ".$searchQuery ." AND active_income=1 AND fechaHora_income BETWEEN '$fechaInicio' AND '$fechaFin'");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM laguna_incomes left join cities on id_city = idCiudad_income LEFT JOIN provinces ON id_province = id_province_city WHERE 1 ".$searchQuery ." AND active_income=1 AND fechaHora_income BETWEEN '$fechaInicio' AND '$fechaFin' ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idIngreso = $row['id_income'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="eliminarIngreso('.$idIngreso.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }

  
  if($row['argentino_income'] == 'ARGENTINA'){
    $provincia = strtoupper($row['name_province']);
    $ciudad = strtoupper($row['name_city']);
  }else{
    $provincia = '';
    $ciudad = '';
  }

  $acciones = $acciones.'</div>';
   $data[] = array(
      "fechaHora_income"=>date('d/m/Y H:s',strtotime($row['fechaHora_income'])),
      "argentino_income"=>strtoupper($row['idTipoLaguna_income']),
      "pais_income"=>strtoupper($row['argentino_income']),
      "name_province"=>strtoupper($provincia),
      "idCiudad_income"=>strtoupper($ciudad),
      "vehiculos_income"=>strtoupper($row['vehiculos_income']),
      "canas_income"=>strtoupper($row['canas_income']),
      "embarcaciones_income"=>strtoupper($row['embarcacion_income']),
      "deporte_income"=>strtoupper($row['deporte_income']),
      "deporteMotor_income"=>strtoupper($row['deporteMotor_income']),
      "guiaPesca_income"=>strtoupper($row['guiaPesca_income']),
      "formaPago_income"=>strtoupper($row['formaPago_income']),
      "total_income"=>strtoupper($row['total_income']),
      "acciones_income"=>$acciones,
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