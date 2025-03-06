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
    $searchQuery = " AND (owner_contact LIKE :name or personalContact_contact LIKE :name or name_contact LIKE :name or phone_contact LIKE :name or horario_contact LIKE :name or details_contact LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  contact_book WHERE active_contact=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  contact_book  WHERE 1 ".$searchQuery ."AND active_contact=1");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM  contact_book WHERE 1 ".$searchQuery ."AND active_contact=1 ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idProfesional = $row['id_contact'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  $acciones = $acciones. '<a href="javascript:;" onclick="VerProfesional('.$idProfesional.')" class="text-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-eye"></i></a>';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones. '<a href="javascript:;" onclick="EditarProfesional('.$idProfesional.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a>';
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarProfesional('.$idProfesional.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  
  $acciones = $acciones.'</div>';
  
  $servicios = str_replace("[","",$row['ids_services_contact']);
  $servicios = str_replace("]","",$servicios);
  $servicios = explode(',',$servicios);
  $serviciosAMostrar = '';
  foreach($servicios as $servicio){
      
    $idServicio = str_replace('"','',$servicio);
    $ObtenerServicio = $conexion -> prepare("SELECT name_service from services_contact_book WHERE id_service=:1");
    $ObtenerServicio -> bindParam(':1',$idServicio);
    $ObtenerServicio -> execute();
    foreach($ObtenerServicio as $Sv){
        $servicioTexto = $Sv['name_service'];
        if($serviciosAMostrar == ''){
            $serviciosAMostrar = $serviciosAMostrar . $servicioTexto;
        }else{
            $serviciosAMostrar = $serviciosAMostrar ." - ". $servicioTexto;
        }
    }
  }
  
   $data[] = array(
      "ids_services_contact"=>$serviciosAMostrar,
      "owner_contact"=>strtoupper($row['owner_contact']),
      "personalContact_contact"=>$row['personalContact_contact'],
      "name_contact"=>strtoupper($row['name_contact']),
      "phone_contact"=>$row['phone_contact'],
      "address_contact"=>$row['address_contact'],
      "horario_contact"=>$row['horario_contact'],
    "details_contact"=>$row['details_contact'],
      "acciones_contact"=>$acciones,
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