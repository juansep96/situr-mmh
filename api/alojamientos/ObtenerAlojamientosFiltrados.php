<?php

require_once('../PDO.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn=$conexion;

$tipoAlojamiento = $_GET['tipo'];
$servicios = json_decode($_GET['servicios']);

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
if($tipoAlojamiento == '0'){
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE active_accomodation=1");
}else{
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE active_accomodation=1 AND id_type_accomodation LIKE '$tipoAlojamiento' ");
}
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering

if($tipoAlojamiento == '0'){
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE 1 ".$searchQuery ."AND active_accomodation=1 ");
}else{
    $stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE 1 ".$searchQuery ."AND active_accomodation=1 AND id_type_accomodation LIKE '$tipoAlojamiento' ");
}

$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records

if($tipoAlojamiento == '0'){
    $stmt = $conn->prepare("SELECT * FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE 1 ".$searchQuery ."AND active_accomodation=1 ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
}else{
    $stmt = $conn->prepare("SELECT * FROM  accomodations LEFT JOIN accomodations_types on id_type_accomodation = id_accomodations_types LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types WHERE 1 ".$searchQuery ."AND active_accomodation=1 AND id_type_accomodation LIKE '$tipoAlojamiento'  ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");
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
    //Tenemos que revisar que los filtros se encuentren dentro de los servicios que ofrece este lugar
    $cumpleTodos = true;
    $listadoOfrecidos = $row['ids_amenities_accomodation'];
    foreach($servicios as $servicio){
        $serv_string = '"'.$servicio.'"';
        if (!(strpos($listadoOfrecidos, $serv_string))) {
            $cumpleTodos = false;
        }
    }
    if($cumpleTodos == true){
        $data[] = array(
            "name_accomodation"=>strtoupper($row['name_accomodation']),
            "address_accomodation"=>strtoupper($row['address_accomodation']),
            "phone_accomodation"=>strtoupper($row['phone_accomodation']),
            "name_accomodations_types"=>strtoupper($row['name_accomodations_types']),
            "name_categories_types"=>strtoupper($row['name_categories_types']),
         );
    }   
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