<?php

require_once('../PDO.php');
$fechaInicio = $_GET['fechaDesde'].' 00:00:00';
$fechaFin = $_GET['fechaHasta'].' 23:59:59';
$conn=$conexion;

$idDependencia =  5;


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
    $searchQuery = " AND (grupoFamiliar_registro LIKE :name,name_city LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM registrosDiarios  WHERE estado_registro=1 AND idDependencia_registro='$idDependencia'");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM registrosDiarios WHERE 1 ".$searchQuery ." AND estado_registro=1 AND idDependencia_registro='$idDependencia' AND fechaHora_registro BETWEEN '$fechaInicio' AND '$fechaFin'");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM registrosDiarios left join cities on id_city = idCiudad_registro LEFT JOIN provinces ON id_province = id_province_city left join users ON idUsuario_registro=id_user  WHERE 1 ".$searchQuery ." AND estado_registro=1 AND idDependencia_registro='$idDependencia' AND fechaHora_registro BETWEEN '$fechaInicio' AND '$fechaFin' ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idRegistro = $row['id_registro'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="eliminarRegistro('.$idRegistro.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  $acciones = $acciones.'</div>';

  if($row['pais_registro'] == 'ARGENTINA'){
    $provincia = strtoupper($row['name_province']);
    $ciudad = strtoupper($row['name_city']);
  }else{
    $provincia = '';
    $ciudad = '';
  }
   $data[] = array(
      "fechaHora_registro"=>date('d/m/Y H:s',strtotime($row['fechaHora_registro'])),
      "idUsuario_registro"=>strtoupper($row['last_name_user'].' '.$row['first_name_user']),
      "primeraVez_registro"=>$row['primeraVez_registro'],
      "grupoFamiliar_registro"=>$row['grupoFamiliar_registro'],
      "pais_registro"=>strtoupper($row['pais_registro']),
      "id_province"=>$provincia,
      "idCiudad_registro"=>$ciudad,
      "comentarios_registro"=>strtoupper($row['comentarios_registro']),
      "acciones_registro"=>$acciones,
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