<?php

// To use PDO to connect to a database, you need the following information:
$servname = "localhost";
$username = "root";
$password = "";
$dbname = "accounts";

// database connection
$conn = mysqli_connect($servname, $username, $password, $dbname);
if(!$conn){
	echo "Connection failed";
}


?>