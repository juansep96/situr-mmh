<?php

require_once('../PDO.php');
$fechaInicio = $_GET['desde'];
$fechaFin = $_GET['hasta'];
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
    $searchQuery = " AND (nombre_respCivil LIKE :name,apellido_respCivil LIKE :name,dni_respCivil LIKE :name,matricula_respCivil LIKE :name,patenteVehiculo_respCivil LIKE :name,apellidoConductor_respCivil LIKE :name,nombreConductor_respCivil LIKE :name ) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM laguna_respCivil  WHERE estado_respCivil=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM laguna_respCivil WHERE 1 ".$searchQuery ." AND estado_respCivil=1 AND fecha_respCivil BETWEEN '$fechaInicio' AND '$fechaFin'");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM laguna_respCivil WHERE 1 ".$searchQuery ." AND estado_respCivil=1 AND fecha_respCivil BETWEEN '$fechaInicio' AND '$fechaFin' ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idRC = $row['id_respCivil'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  $acciones = $acciones . '<a href="javascript:;" onclick="verRC('.$idRC.')" class="text-export" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Editar"><i class="bi bi-eye"></i></a>';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="eliminarRC('.$idRC.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }

  $nombre = '';
  if($row['apellido_respCivil']){
    $nombre = $nombre . ' ' .$row['apellido_respCivil'];
  }
  if($row['nombre_respCivil']){
    $nombre = $nombre . ' ' .$row['nombre_respCivil'];
  }
  $acciones = $acciones.'</div>';
   $data[] = array(
      "fecha_respCivil"=>date('d/m/Y',strtotime($row['fecha_respCivil'])),
      "horaIngreso_respCivil"=>$row['horaIngreso_respCivil'],
      "horaEgreso_respCivil"=>$row['horaSalida_respCivil'],
      "nombre_respCivil"=>strtoupper($nombre),
      "matricula_respCivil"=>strtoupper($row['matricula_respCivil']),
      "carnet_respCivil"=>strtoupper($row['carnet_respCivil']),
      "patenteVehiculo_respCivil"=>strtoupper($row['patenteVehiculo_respCivil']),
      "acciones_respCivil"=>$acciones,
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