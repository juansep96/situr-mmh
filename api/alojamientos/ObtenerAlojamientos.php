<?php

require_once('../PDO.php');

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
    $searchQuery = " AND (name_categories_types LIKE :name or name_accomodations_types LIKE :name or name_accomodation LIKE :name or phone_accomodation LIKE :name or address_accomodation LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE active_accomodation=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE 1 ".$searchQuery ."AND active_accomodation=1");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE 1 ".$searchQuery ."AND active_accomodation=1 ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

// Bind values
foreach($searchArray as $key=>$search){
   $stmt->bindValue(':'.$key, $search,PDO::PARAM_STR);
}

$stmt->bindValue(':limit', (int)$row, PDO::PARAM_INT);
$stmt->bindValue(':offset', (int)$rowperpage, PDO::PARAM_INT);
$stmt->execute();
$empRecords = $stmt->fetchAll();

$data = array();

foreach($empRecords as $row){
  $idAlojamiento = $row['id_accomodation'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones. '<a href="javascript:;" onclick="EditarAlojamiento('.$idAlojamiento.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a>';
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarAlojamiento('.$idAlojamiento.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  
  $acciones = $acciones.'</div>';
   $data[] = array(
      "name_accomodation"=>strtoupper($row['name_accomodation']),
      "address_accomodation"=>strtoupper($row['address_accomodation']),
      "phone_accomodation"=>strtoupper($row['phone_accomodation']),
      "name_accomodations_types"=>strtoupper($row['name_accomodations_types']),
      "name_categories_types"=>strtoupper($row['name_categories_types']),
      "acciones_accomodation"=>$acciones,
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