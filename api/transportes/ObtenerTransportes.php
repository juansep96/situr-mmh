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
    $searchQuery = " AND (name_transportation LIKE :name or phone_transportation LIKE :name or address_transportation LIKE :name or email_transportation LIKE :name ) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  transportations LEFT JOIN transportations_types on id_transportations_type  = id_type_transportation WHERE active_transportation=1");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM  transportations LEFT JOIN transportations_types on id_transportations_type  = id_type_transportation WHERE 1 ".$searchQuery ." AND active_transportation=1");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM transportations LEFT JOIN transportations_types on id_transportations_type  = id_type_transportation WHERE 1 ".$searchQuery ." AND active_transportation=1 ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idTransporte = $row['id_transportation'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  $acciones = $acciones. '<a href="javascript:;" onclick="VerTransporte('.$idTransporte.')" class="text-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-eye"></i></a>';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones. '<a href="javascript:;" onclick="EditarTransporte('.$idTransporte.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit info" aria-label="Editar"><i class="bi bi-pencil-fill"></i></a>';
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarTransporte('.$idTransporte.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  $destinos = str_replace("[","",$row['ids_destines_transportation']);
  $destinos = str_replace("]","",$destinos);
  $destinos = explode(',',$destinos);
  $destinosAMostrar = '';
  foreach($destinos as $destino){
    $idCiudad = str_replace('"','',$destino);
    $ObtenerDestino = $conexion -> prepare("SELECT name_city from cities WHERE id_city=:1");
    $ObtenerDestino -> bindParam(':1',$idCiudad);
    $ObtenerDestino -> execute();
    foreach($ObtenerDestino as $DestinoDetallado){
        $destinoTexto = $DestinoDetallado['name_city'];
        if($destinosAMostrar == ''){
            $destinosAMostrar = $destinosAMostrar . $destinoTexto;
        }else{
            $destinosAMostrar = $destinosAMostrar ." - ". $destinoTexto;
        }
    }
  }
  $acciones = $acciones.'</div>';
   $data[] = array(
      "name_transportation"=>$row['name_transportation'],
      "address_transportation"=>$row['address_transportation'],
      "phone_transportation"=>$row['phone_transportation'],
      "horarioAtencion_transportation"=>$row['horarioAtencion_transportation'],
      "name_transportations_type"=>strtoupper($row['name_transportations_type']),
      "ids_destines_transportation"=>$destinosAMostrar,
      "acciones_transportation"=>$acciones,
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