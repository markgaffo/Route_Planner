<?php

session_start();

if (!isset($_SESSION['loggedin'])) {
	header('Location: index.php');
	exit();
}
$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'id11543893_registrationuser';
$DATABASE_PASS = 'registration';
$DATABASE_NAME = 'id11543893_registration';
$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if (mysqli_connect_errno()) {
	die ('Failed to connect to MySQL: ' . mysqli_connect_error());
}

$stmt = $con->prepare('SELECT email, age, height, weight, gender FROM accounts WHERE id = ?');

$stmt->bind_param('i', $_SESSION['id']);
$stmt->execute();
$stmt->bind_result($email, $age, $height, $weight, $gender);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html>
  <!-- AIzaSyD3DS7vl0hBWsboxGivtpkAC92As2Kcbhw -->
<head>
  <title>SoFit - Profile</title>
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="styles.css" rel="stylesheet">
  
  <!--stylesheet and boostrap first then javascript -->
  <script src="vendor/jquery/jquery.slim.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyD3DS7vl0hBWsboxGivtpkAC92As2Kcbhw"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" type="text/javascript"></script>
  <script src="script1.js"></script>
</head>

<body>
 <nav class="navbar navbar-expand-lg navbar-dark bg-dark static-top">
    <div class="container">
      <h1><a class="navbar-brand" href="#">SoFit</a></h1>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="index.php">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="contact.html">Contact</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="about.html">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="log.html">Log in</a>
          </li>
		  <li class="nav-item">
            <a class="nav-link" href="register.html">Register</a>
          </li>
          
          <li class="nav-item active">
            <a class="nav-link" href="profile.php">Profile
              <span class="sr-only">(current)</span>
            </a>
          </li>
          
		  
          <li class="nav-item">
           <a href="logout.php" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
<div class="container">
    <div class="content">
			<h2>Profile Page</h2>
			<div>
				<p>Your account details are below:</p>
				<table>
					<tr>
						<td>Username:</td>
						<td><?=$_SESSION['name']?></td>
					</tr>
					
					<tr>
						<td>Email:</td>
						<td><?=$email?></td>
					</tr>
					<tr>
						<td>Age:</td>
						<td><?=$age?></td>
					</tr>
					<tr>
						<td>Height:</td>
						<td><?=$height?></td>
					</tr>
					<tr>
						<td>Weight:</td>
						<td><?=$weight?></td>
					</tr>
					<tr>
						<td>Gender:</td>
						<td><?=$gender?></td>
					</tr>
				</table>
			</div>
		</div>
		
        <!--<ul class="list-unstyled">
          <li>Bootstrap 4.3.1</li>
          <li>jQuery 3.4.1</li>
        </ul>-->
      </div>
    </div>
  </div>
   <center><footer id="footer">Copyright &copy; So-fit 2019 Home | About us | Services | Contact Us </footer></center>
</body>

</html>