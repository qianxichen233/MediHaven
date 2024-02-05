<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "accounts";

// database connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
if(!$conn){
	echo "Connection failed";
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["uname"];
    $password = $_POST["pwd"];

    // Perform SQL query to check credentials
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "Login successful!";
        header("Location: search.php");
	exit();
    } else {
        echo "Invalid username or password";
    }
}

// Close the connection
$conn->close();

?>