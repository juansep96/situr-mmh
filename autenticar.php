<!doctype html>
<html lang="es" class="light-theme">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="assets/images/favicon-32x32.png" type="image/png" />
  <!-- Bootstrap CSS -->
  <link href="assets/css/bootstrap.css" rel="stylesheet" />
  <link href="assets/css/bootstrap-extended.css" rel="stylesheet" />
  <link href="assets/css/style.css" rel="stylesheet" />
  <link href="assets/css/icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  <!--plugins-->
  <link rel="stylesheet" href="./assets/plugins/notifications/css/lobibox.min.css" />

  <!-- loader-->
	<link href="assets/css/pace.min.css" rel="stylesheet" />

  <title>SigTur - Iniciar Sesion - Secretaria de Turismo de Monte Hermoso</title>
  <style>
    .iconError{
        font-size:5em !important;
        color:red !important;
    }
  </style>
</head>

<body onload="autoLogin()">

  <!--start wrapper-->
  <div class="wrapper">

       <!--start content-->
       <main class="authentication-content">
        <div class="container-fluid">
          <div class="authentication-card">
            <div class="card shadow rounded-0 overflow-hidden p-5">
              <div class="row g-0">
                <div class="col-lg-12 bg-login d-flex align-items-center justify-content-center" style="background:white !important">
                  <img src="./assets/images/logo.png" class="img-fluid" alt="">
                </div>
              </div>
              <div class="row g-0">
                <div id="mensaje" class="p-5 col-lg-12 bg-login text-center" style="background:white !important">
                    <h2>Iniciando autenticación</h2>
                    <div class="spinner-border text-center mt-3" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       </main>

       <!--end page main-->

  </div>
  <!--end wrapper-->


  <!-- Bootstrap bundle JS -->
  <script src="assets/js/bootstrap.bundle.min.js"></script>
  <!--plugins-->
  <script src="./assets/js/jquery-3.6.0.js"></script>
  <!--notification js -->
  <script src="./assets/plugins/notifications/js/notifications.js"></script>
  <script src="./assets/js/pace.min.js"></script>
  <!--app-->
  <script src="./js/index.js?v=2.1"></script>



</body>

</html>
