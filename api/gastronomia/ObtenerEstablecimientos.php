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
    $searchQuery = " AND (name_gastronomy LIKE :name or phone_gastronomy LIKE :name or address_gastronomy LIKE :name or details_gastronomy LIKE :name OR name_gastronomy_type LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  gastronomy LEFT JOIN gastronomy_types on id_gastronomy_type = id_type_gastronomy WHERE active_gastronomy=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  gastronomy LEFT JOIN gastronomy_types on id_gastronomy_type = id_type_gastronomy WHERE 1 ".$searchQuery ."AND active_gastronomy=1");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM  gastronomy LEFT JOIN gastronomy_types on id_gastronomy_type = id_type_gastronomy WHERE 1 ".$searchQuery ."AND active_gastronomy=1 ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idEstablecimiento = $row['id_gastronomy'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  $acciones = $acciones. '<a href="javascript:;" onclick="VerEstablecimiento('.$idEstablecimiento.')" class="text-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-eye"></i></a>';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones. '<a href="javascript:;" onclick="EditarEstablecimiento('.$idEstablecimiento.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a>';
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarEstablecimiento('.$idEstablecimiento.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  
  $acciones = $acciones.'</div>';
   $data[] = array(
      "name_gastronomy"=>strtoupper($row['name_gastronomy']),
      "address_gastronomy"=>strtoupper($row['address_gastronomy']),
      "phone_gastronomy"=>$row['phone_gastronomy'],
      "name_gastronomy_type"=>strtoupper($row['name_gastronomy_type']),
      "id_gastronomy_type"=>$row['id_gastronomy_type'],
      "quantity_guests_gastronomy"=>$row['quantity_guests_gastronomy'],
      "details_gastronomy"=>strtoupper($row['details_gastronomy']),
      "acciones_gastronomy"=>$acciones,
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