
<!DOCTYPE html>
<html>
  <!-- AIzaSyD3DS7vl0hBWsboxGivtpkAC92As2Kcbhw -->
<head>
  <title>SoFit</title>
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
          <li class="nav-item active">
            <a class="nav-link" href="index.php">Home
              <span class="sr-only">(current)</span>
            </a>
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
          <li class="nav-item">
            <a class="nav-link" href="profile.php">Profile</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

<div id="content">
  <left><div id="map-canvas" style="width:100%; height:900px;"></div>
  <div class="hr vpad"></div></left>

<right>
  <div id="info">
   
        <h2><p><b>Information</b></p></h2>
        <p id="how-to"><b>How to use:</b> Place markers down on the map where you wish to walk, run or cycle along. You can then place addiontal markers on the map if you want a friend to join from a new area. After you can then press the calculate route button which will update the map and display a route. This route will show you the quickest way to go to each marker you placed back around.</p>
        
        
        <button id="calc-route">Calculate  Route</button> <button id="clear">Clear</button>
        <h3><p><b>Route Information</b></p></h3>
       
            <b>Markers Placed:</b>
            <p id="dest-count">0</p>
        
            <b>Times route have been tested:</b> <p id="gen-passed">0</p>
        
            <b><p class="info">Distance(Km): </b><p id="best-route">0</p></p>
        
       
 </div>
  </right
  </div>
 

   
</body>

</html>
