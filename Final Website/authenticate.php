<?php
session_start();

$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'id11543893_registrationuser';
$DATABASE_PASS = 'registration';
$DATABASE_NAME = 'id11543893_registration';
//Connection
$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	//Error Warning
	die ('Failed to connect to MySQL: ' . mysqli_connect_error());
}
// Check the form
if ( !isset($_POST['username'], $_POST['password']) ) {
	// Coant get the data that should have been sent.
	die ('Please fill out both the username and password field!');

}
// Prepare SQL,  will prevent SQL injection.
if ($stmt = $con->prepare('SELECT id, password FROM accounts WHERE username = ?')) {
	
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	// store results and compare info in database
	$stmt->store_result();}
	if ($stmt->num_rows > 0) {
	$stmt->bind_result($id, $password);
	$stmt->fetch();
	// Account eis there, now  verify the password.
	//.
	if (password_verify($_POST['password'], $password)) {
		// Verification success
		// Create sessions so we know the user is logged in
		session_regenerate_id();
		$_SESSION['loggedin'] = TRUE;
		
		$_SESSION['id'] = $id;
		$_SESSION['name'] = $_POST['username'];
	
		
		header('Location: home.php');
	} else {
		echo 'Incorrect password! ';
		echo "<a href=\"https://sofitapp.000webhostapp.com/log.html\" target=\"_BLANK\">Click here to log in again.</a>";
	}
} else {
	echo 'Incorrect username! ';
	echo "<a href=\"https://sofitapp.000webhostapp.com/log.html\" target=\"_BLANK\">Click here to log in again.</a>";
}
$stmt->close();
?>