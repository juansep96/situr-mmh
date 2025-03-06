<?php

require_once "../PDO.php";

$conn=$conexion;
$fecha = $_GET['fecha'];
$fecha = str_replace('T',' ',$fecha).':00';
$fechaHasta = $_GET['fechaHasta'];
$fechaHasta = str_replace('T',' ',$fechaHasta).':00';
$idSucursal = $_GET['idSucursal'];


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
    $searchQuery = " AND (id_arqueo LIKE :name) ";
    $searchArray = array(
        'name'=>"%$searchValue%"
   );
}

## Total number of records without filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM arqueos WHERE estado_arqueo=1  AND (fechaHora_arqueo BETWEEN '$fecha' AND '$fechaHasta')");
$stmt->execute();
$records = $stmt->fetch();
$totalRecords = $records['allcount'];

## Total number of records with filtering
$stmt = $conn->prepare("SELECT COUNT(*) AS allcount FROM arqueos WHERE 1 ".$searchQuery ."AND estado_arqueo=1   AND (fechaHora_arqueo BETWEEN '$fecha' AND '$fechaHasta') ");
$stmt->execute($searchArray);
$records = $stmt->fetch();
$totalRecordwithFilter = $records['allcount'];

## Fetch records
$stmt = $conn->prepare("SELECT * FROM arqueos LEFT JOIN users ON id_user=idUsuario_arqueo WHERE estado_arqueo=1   AND (fechaHora_arqueo BETWEEN '$fecha' AND '$fechaHasta') LIMIT :limit,:offset");

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
  $fecha = date('d/m/Y',strtotime($row['fechaHora_arqueo']));
  $hora = date('H:i',strtotime($row['fechaHora_arqueo']));
  $idArqueo = $row['id_arqueo'];
  $acciones = '<div class="d-flex align-items-center gap-3 fs-6">';
  if($_SESSION['name_role']=='Administrador'){
    $acciones = $acciones . '<a href="javascript:;" onclick="EliminarArqueo('.$idArqueo.')" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Eliminar Arqueo" aria-label="Eliminar"><i class="bi bi-trash-fill"></i></a>';
  }
  $acciones=$acciones ."</div>";
   $data[] = array(
      "fecha_arqueo"=>$fecha,
      "hora_arqueo" => $hora,
      "name_user"=>strtoupper($row['last_name_user']. ' ' .$row['first_name_user'] ),
      "efectivo_arqueo"=>"$ ".$row['efectivo_arqueo'],
      "transferencia_arqueo"=>"$ ".$row['transferencia_arqueo'],
      "ingresos_arqueo"=>"$ ".$row['ingresos_arqueo'],
      "acciones_arqueo"=>$acciones,
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
