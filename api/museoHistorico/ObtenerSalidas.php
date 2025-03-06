<?php

require_once('../PDO.php');
$fechaInicio = $_GET['fechaDesde'];
$fechaFin = $_GET['fechaHasta'];
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
    $searchQuery = " AND (nombre_institucion LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM museoHistorico_salidas left join instituciones ON idInstitucion_salida = id_institucion  WHERE estado_salida=1 ");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM museoHistorico_salidas left join instituciones ON idInstitucion_salida = id_institucion WHERE 1 ".$searchQuery ." AND estado_salida=1  AND fecha_salida BETWEEN '$fechaInicio' AND '$fechaFin'");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM museoHistorico_salidas left join instituciones ON idInstitucion_salida = id_institucion WHERE 1 ".$searchQuery ." AND estado_salida=1  AND fecha_salida BETWEEN '$fechaInicio' AND '$fechaFin' ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

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
  $idSalida = $row['id_salida'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="editarSalida('.$idSalida.')" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Editar"><i class="bi bi-pencil"></i></a>';
    $acciones = $acciones . '<a href="javascript:;" onclick="eliminarSalida('.$idSalida.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  $acciones = $acciones.'</div>';
   $data[] = array(
      "fecha_salida"=>date('d/m/Y',strtotime($row['fecha_salida'])),
      "idInstitucion_salida"=>strtoupper($row['nombre_institucion']),
      "curso_salida"=>$row['curso_salida'],
      "cantidad_salida"=>$row['cantidad_salida'],
      "acciones_salida"=>$acciones,
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