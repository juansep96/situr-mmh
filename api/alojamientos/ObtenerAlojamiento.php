<?php

require_once('../PDO.php');

$idAlojamiento = $_POST['idAlojamiento'];

$ObtenerCiudad = $conexion -> prepare("SELECT * FROM accomodations left join accomodations_types on id_accomodations_types = id_type_accomodation LEFT JOIN categories_types ON id_type_category_accomodation = id_categories_types  WHERE id_accomodation =:1");
$ObtenerCiudad -> bindParam(':1',$idAlojamiento);
$ObtenerCiudad -> execute();

$result = $ObtenerCiudad->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>
