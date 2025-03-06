<?php

require_once('../../PDO.php');

$ObtenerAlojamientos = $conexion -> query("SELECT name_accomodation,phone_accomodation,address_accomodation,name_accomodations_types,name_categories_types FROM accomodations left join accomodations_types on id_accomodations_types = id_type_accomodation left join categories_types on id_categories_types = id_type_category_accomodation WHERE active_accomodation = 1 ORDER BY name_accomodation ASC");

$result = $ObtenerAlojamientos->fetchAll(\PDO::FETCH_ASSOC);
print_r (json_encode($result));

?>