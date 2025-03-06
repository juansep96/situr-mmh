<?php

require_once('./PDO.php');

if(isset($_SESSION['id_user'])){
    echo "YES";
}else{
    echo "NO";
}

?>