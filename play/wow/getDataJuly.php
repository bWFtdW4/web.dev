<?php
/*
* Database credentials
*/
$servername = "localhost";
$username = "USER56381_wowt01";
$password = "f_DPPCAUHizmFxNLdWwVT9B2";
$database = "db_56381_1";

/*
* Create connection
*/
$conn = new mysqli($servername, $username, $password, $database);

/*
* Check connection
*/
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
 
/*
* Perform a SELECT query
*/
$sql = "SELECT * FROM july";
$result = $conn->query($sql);

/*
* Convert the result to an associative array
*/
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

/*
* Output the data as JSON
*/
header('Content-Type: application/json');
echo json_encode($data);

/*
* Close the database connection
*/
$conn->close();
?>
