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
    $searchQuery = " AND (name_tourist_atraction LIKE :name or address_tourist_atraction LIKE :name or details_tourist_atraction LIKE :name or horario_tourist_atraction LIKE :name or dia_tourist_atraction LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
if($_GET['dia'] == 'Todos'){
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  tourist_atractions WHERE active_tourist_atraction=1 AND name_tourist_atraction LIKE '$nombre' ");
}else{
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  tourist_atractions WHERE active_tourist_atraction=1 AND dia_tourist_atraction LIKE '$dia'  AND name_tourist_atraction LIKE '$nombre' ");
}
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering

if($_GET['dia']== 'Todos'){
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  tourist_atractions WHERE 1 ".$searchQuery ." AND active_tourist_atraction=1  AND name_tourist_atraction LIKE '$nombre' ");
}else{
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  tourist_atractions WHERE 1 ".$searchQuery ." AND active_tourist_atraction=1 AND dia_tourist_atraction LIKE '$dia'  AND name_tourist_atraction LIKE '$nombre'  ");
}

$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records

if($_GET['dia'] == 'Todos'){
    $stmt = $conn->prepare("SELECT * FROM  tourist_atractions WHERE 1 ".$searchQuery ." AND active_tourist_atraction=1  AND name_tourist_atraction LIKE '$nombre'  ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
}else{
    $stmt = $conn->prepare("SELECT * FROM  tourist_atractions WHERE 1 ".$searchQuery ." AND active_tourist_atraction=1  AND name_tourist_atraction LIKE '$nombre'  AND dia_tourist_atraction LIKE '$dia'  ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
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
    $idAtractivo = $row['id_tourist_atraction'];
    $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
    if($_SESSION['name_role']=='Administrador'){
      $acciones = $acciones. '<a href="javascript:;" onclick="EditarAtractivo('.$idAtractivo.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a>';
      $acciones = $acciones . '<a href="javascript:;" onclick="EliminarAtractivo('.$idAtractivo.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
    }
    
    $acciones = $acciones.'</div>';

    $data[] = array(
        "name_tourist_atraction"=>$row['name_tourist_atraction'],
        "dia_tourist_atraction"=>$row['dia_tourist_atraction'],
        "horario_tourist_atraction"=>$row['horario_tourist_atraction'],
        "address_tourist_atraction"=>$row['address_tourist_atraction'],
        "contacto_tourist_atraction"=>$row['contacto_tourist_atraction'],
        "details_tourist_atraction"=>$row['details_tourist_atraction'],
        "acciones_tourist_atraction"=>$acciones
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