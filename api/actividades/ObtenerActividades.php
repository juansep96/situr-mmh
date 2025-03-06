<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../PDO.php');

$conn=$conexion;

$dia = '%'.$_GET['dia'].'%';
$nombre = '%'.$_GET['actividad'].'%';
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
    $searchQuery = " AND (name_activity LIKE :name or address_activity LIKE :name or details_activity LIKE :name or hora_activity LIKE :name or dia_activity LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
if($_GET['dia'] == 'Todos'){
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  progr_activities WHERE active_activity=1 AND name_activity LIKE '$nombre' ");
}else{
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  progr_activities WHERE active_activity=1 AND dia_activity LIKE '$dia'  AND name_activity LIKE '$nombre' ");
}
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering

if($_GET['dia']== 'Todos'){
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  progr_activities WHERE 1 ".$searchQuery ." AND active_activity=1  AND name_activity LIKE '$nombre' ");
}else{
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  progr_activities WHERE 1 ".$searchQuery ." AND active_activity=1 AND dia_activity LIKE '$dia'  AND name_activity LIKE '$nombre'  ");
}

$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records

if($_GET['dia'] == 'Todos'){
    $stmt = $conn->prepare("SELECT * FROM  progr_activities WHERE 1 ".$searchQuery ." AND active_activity=1  AND name_activity LIKE '$nombre'  ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
}else{
    $stmt = $conn->prepare("SELECT * FROM  progr_activities WHERE 1 ".$searchQuery ." AND active_activity=1  AND name_activity LIKE '$nombre'  AND dia_activity LIKE '$dia'  ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
}

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
    $idActividad = $row['id_activity'];
    $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
    if($_SESSION['name_role']=='Administrador'){
      $acciones = $acciones. '<a href="javascript:;" onclick="EditarActividad('.$idActividad.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a>';
      $acciones = $acciones . '<a href="javascript:;" onclick="EliminarActividad('.$idActividad.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
    }
    
    $acciones = $acciones.'</div>';

    $data[] = array(
        "name_activity"=>$row['name_activity'],
        "dia_activity"=>$row['dia_activity'],
        "hora_activity"=>$row['hora_activity'],
        "valor_activity"=>"$ ".$row['valor_activity'],
        "direccion_activity"=>$row['direccion_activity'],
        "details_activity"=>$row['details_activity'],
        "acciones_activity"=>$acciones
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