<?php

$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'id11543893_registrationuser';
$DATABASE_PASS = 'registration';
$DATABASE_NAME = 'id11543893_registration';

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if (mysqli_connect_errno()) {
	
	die ('Failed to connect to MySQL: ' . mysqli_connect_error());
}


if (!isset($_POST['username'], $_POST['password'], $_POST['email'])) {
	// Could not get the data that should have been sent.
	die ('Please complete the registration form!');
}

if (empty($_POST['username']) || empty($_POST['password']) || empty($_POST['email']) || empty($_POST['age']) || empty($_POST['height']) || empty($_POST['weight']) || empty($_POST['gender'])) {
	// One or more values are empty.
	die ('Please complete the registration form');
}
if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
	die ('Email is not valid!');
}
if (preg_match('/[A-Za-z0-9]+/', $_POST['username']) == 0) {
    die ('Username is not valid!');
}
if (strlen($_POST['password']) > 20 || strlen($_POST['password']) < 5) {
	die ('Password must be between 5 and 20 characters long!');
}
// Check if there is same username
if ($stmt = $con->prepare('SELECT id, password FROM accounts WHERE username = ?')) {
	
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	$stmt->store_result();
	//check if the account exists in the database.
	if ($stmt->num_rows > 0) {
		// Username already exists
		echo 'Username exists, please choose another!';
	} else {
		// Username doesnt exists, insert new account
if ($stmt = $con->prepare('INSERT INTO accounts (username, password, email, age, height, weight, gender) VALUES (?, ?, ?, ?, ?, ?, ?)')) {
	// 
	$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
	$stmt->bind_param('sssssss', $_POST['username'], $password, $_POST['email'], $_POST['age'], $_POST['height'], $_POST['weight'], $_POST['gender']);
	$stmt->execute();
	echo 'You have successfully registered, you can now login! ';
	echo "<a href=\"https://sofitapp.000webhostapp.com/log.html\" target=\"_BLANK\">Click here to log in.</a>";

} else {
	
	echo 'Could not prepare statement!';
}
	}
	$stmt->close();
} else {
	
	echo 'Could not prepare statement!';
}
$con->close();
?>